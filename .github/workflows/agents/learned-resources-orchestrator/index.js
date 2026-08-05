#!/usr/bin/env node
/*
 Learned Resources Orchestrator
 - Scans resources/learned-resources
 - Updates resources/learned-resources/featureparity-and-highlevel-goals.md
 - Replaces content between markers <!-- BEGIN AUTOGEN PROGRESS --> and <!-- END AUTOGEN PROGRESS -->

 Intended to be run by CI (GitHub Actions) or manually.
*/

const fs = require('fs');
const path = require('path');

function humanSize(bytes){
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const resourcesDir = path.join(repoRoot, 'resources', 'learned-resources');
const livingDoc = path.join(resourcesDir, 'featureparity-and-highlevel-goals.md');

if (!fs.existsSync(resourcesDir)) {
  console.error('Resources directory not found:', resourcesDir);
  console.error('Create resources/learned-resources or run from repository root. Exiting.');
  process.exit(0);
}

const entries = fs.readdirSync(resourcesDir).filter(f => f !== path.basename(livingDoc));
const files = entries.filter(name => {
  try { return fs.statSync(path.join(resourcesDir, name)).isFile(); }
  catch (e) { return false; }
});

let todoCount = 0;
let doneCount = 0;
const rows = [];

files.forEach(file => {
  const p = path.join(resourcesDir, file);
  const raw = fs.readFileSync(p, 'utf8');
  const stat = fs.statSync(p);
  const mtime = stat.mtime.toISOString();
  const size = stat.size;
  let status = 'Unknown';
  const m = raw.match(/^(?:Status|Progress):\s*(.+)$/im);
  if (m) status = m[1].trim();
  else if (/TODO|FIXME|TO DO/i.test(raw)) { status = 'Has TODO/FIXME'; todoCount++; }
  else if (/\b(done|completed|finished)\b/i.test(raw)) { status = 'Likely done'; doneCount++; }

  const fileRel = path.join('resources','learned-resources', file).split(path.sep).join('/');
  rows.push(`| [${file}](${fileRel}) | ${humanSize(size)} | ${mtime} | ${status} |`);
});

const generated = [];
generated.push('<!-- BEGIN AUTOGEN PROGRESS -->');
generated.push('');
generated.push(`_Auto-generated progress snapshot: ${new Date().toISOString()}_`);
generated.push('');
generated.push('### Summary');
generated.push('');
generated.push(`- Total files scanned: **${files.length}**`);
generated.push(`- Files with TODO/FIXME: **${todoCount}**`);
generated.push(`- Files likely done: **${doneCount}**`);
generated.push('');
if (rows.length === 0) {
  generated.push('_No resource files found in resources/learned-resources._');
} else {
  generated.push('| File | Size | Last modified | Detected status |');
  generated.push('|---|---:|---|---|');
  generated.push(...rows);
}
generated.push('');
generated.push('<!-- END AUTOGEN PROGRESS -->');

const autogenBlock = generated.join('\n');

let docContent = '';
let existed = fs.existsSync(livingDoc);
if (existed) docContent = fs.readFileSync(livingDoc, 'utf8');
else {
  docContent = `# Feature parity & high-level goals\n\nThis living document is the canonical place to track progress, review outcomes, and capture high-level goals for the "learned-resources" collection. The orchestrator (in .github/agents/learned-resources-orchestrator) updates the "Current progress" section automatically.\n\n## Purpose\n- Track ongoing work, discoveries, and evidence of feature parity.\n- Guide deep thinking and critiques during reviews.\n- Provide a single place to summarize status and next steps.\n\n## How the orchestrator works\n- Scans resources/learned-resources for files.\n- Detects simple status hints (frontmatter like `Status:` / `Progress:`, TODO/FIXME markers, common "done" words).\n- Replaces the auto-generated "Current progress" section (between markers) so humans can add notes elsewhere in the document.\n\n## Guidance for deep thinking\n- Use the Goals section to set measurable targets.\n- In reviews, respond to findings with specific corrective tasks and add them to the repository TODOs.\n\n## Review & critique checklist\n- Are assumptions documented for each resource?\n- Are open questions labeled clearly (TODO/QUESTION)?\n- Does any resource claim "done" without tests or verification steps?\n\n## Current progress\n\n` + autogenBlock + `\n\n## Notes (manual)\n- Use this area for human-written context, insights, and critiques that should not be overwritten by the orchestrator.\n`;
}

function replaceAutogen(doc, block) {
  const begin = '<!-- BEGIN AUTOGEN PROGRESS -->';
  const end = '<!-- END AUTOGEN PROGRESS -->';
  if (doc.includes(begin) && doc.includes(end)) {
    const before = doc.split(begin)[0];
    const after = doc.split(end).slice(1).join(end);
    return before + block + after;
  }
  // If markers not present, append under "## Current progress" if present, otherwise add at end
  const markerHeading = '## Current progress';
  if (doc.includes(markerHeading)) {
    const idx = doc.indexOf(markerHeading);
    const head = doc.slice(0, idx + markerHeading.length);
    const tail = doc.slice(idx + markerHeading.length);
    return head + '\n\n' + block + '\n' + tail;
  }
  return doc + '\n\n' + block;
}

const newDoc = replaceAutogen(docContent, autogenBlock);

if (!existed || newDoc !== docContent) {
  fs.writeFileSync(livingDoc, newDoc, 'utf8');
  console.log('UPDATED:', livingDoc);
} else {
  console.log('NO_CHANGES:', livingDoc);
}

// Exit 0 always; CI step will decide whether to commit based on git status.
process.exit(0);

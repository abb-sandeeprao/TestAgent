---
name: class-doc-puml
description: 'Generate Markdown documentation for a selected class with high-level PlantUML sequence and class diagrams. Use for class design docs, onboarding docs, architecture handoff, and PR documentation.'
argument-hint: 'Class name (and optional file path) to document'
user-invocable: true
---

# Class Documentation With PUML

## What This Skill Produces
- One Markdown file documenting the selected class.
- A high-level PlantUML class diagram inside a ```puml``` block.
- A high-level PlantUML sequence diagram inside a ```puml``` block.

## When to Use
- You need architecture-level documentation for a class.
- You are preparing design docs or PR notes.
- You want consistent class documentation with diagrams.

## Inputs
- Required: selected class name.
- Optional: class file path.
- Optional: output Markdown path.

## Quick Checklist Workflow
1. Locate the target class and read its public methods, dependencies, and collaborators.
2. Determine the class role and the primary interaction flow to document.
3. Create the Markdown file using [class-doc template](./assets/class-doc-template.md).
4. Fill in the high-level class diagram:
- Include the selected class and only key collaborators.
- Show main relationships: association, dependency, inheritance, or composition.
5. Fill in the high-level sequence diagram:
- Show one main scenario (happy path).
- Include caller, selected class, and key collaborators.
6. Run quality checks before finalizing:
- Both diagrams are present in separate ```puml``` blocks.
- Diagram participants and class names match code symbols.
- Content stays high-level (no line-by-line logic).
- Markdown headings and sections are complete.

## Decision Points
- If the class has many collaborators, include only the top 3-6 most relevant.
- If there are multiple important flows, document the primary flow first; add one optional alternate flow only if needed.
- If implementation details are unclear, prefer explicit assumptions in a short "Assumptions" section.

## Completion Criteria
- Output is a single Markdown file.
- The file contains:
- Class purpose and responsibilities.
- Public API summary.
- High-level class diagram (PlantUML).
- High-level sequence diagram (PlantUML).
- Assumptions/limits where applicable.

## Notes
- Keep diagrams abstract and architecture-focused.
- Do not generate exhaustive method-level sequences unless explicitly requested.

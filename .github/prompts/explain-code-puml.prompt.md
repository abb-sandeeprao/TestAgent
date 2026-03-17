---
description: "Explain selected code with architecture-focused Markdown, including PlantUML class and sequence diagrams. Use for onboarding, design review, and PR documentation."
name: "Explain Code With PUML"
argument-hint: "Target class or file path (optional)"
agent: "agent"
---
Generate a concise code explanation from the current selection or referenced target.

Inputs:
- Primary: selected code in the editor.
- Optional argument: class name or file path to focus on.

Requirements:
- Explain purpose and responsibilities in plain language.
- Identify key collaborators or dependencies.
- Summarize public API or key methods.
- Include BOTH diagrams in separate `puml` fenced blocks:
  1. High-level class diagram
  2. High-level sequence diagram for the main happy-path flow
- Keep diagrams architecture-level and readable; avoid line-by-line control flow.
- Ensure symbol names used in diagrams match names in code.

Output format (Markdown):

# <ClassOrModuleName> Explanation

## Overview
- Purpose:
- Primary responsibilities:
- Important constraints:

## Key Collaborators
- <CollaboratorName>: role

## API Summary
- <methodName>(...): behavior

## Class Diagram (PlantUML)
```puml
@startuml
skinparam classAttributeIconSize 0
class <ClassOrModuleName>
class <CollaboratorA>
<ClassOrModuleName> --> <CollaboratorA> : uses
@enduml
```

## Sequence Diagram (PlantUML)
```puml
@startuml
actor Caller
participant <ClassOrModuleName>
participant <CollaboratorA>
Caller -> <ClassOrModuleName> : invoke operation
<ClassOrModuleName> -> <CollaboratorA> : request/action
<CollaboratorA> --> <ClassOrModuleName> : response
<ClassOrModuleName> --> Caller : result
@enduml
```

## Assumptions
- List assumptions if behavior is inferred.

Quality checks before final answer:
- Both `puml` blocks exist and renderable syntax is used.
- Diagram entities align with real code symbols.
- Output stays high-level and avoids speculative internals.

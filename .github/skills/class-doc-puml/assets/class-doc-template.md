# <ClassName> Documentation

## Overview
- Purpose:
- Primary responsibility:
- Key constraints:

## Public API Summary
- `<methodName>(...)`:
- `<methodName>(...)`:

## Key Collaborators
- `<CollaboratorA>`: role
- `<CollaboratorB>`: role

## Class Diagram (PlantUML)
```puml
@startuml
skinparam classAttributeIconSize 0

class <ClassName> {
  +<publicMethod>(...)
}

class <CollaboratorA>
class <CollaboratorB>

<ClassName> --> <CollaboratorA> : uses
<ClassName> *-- <CollaboratorB> : owns/contains
@enduml
```

## Sequence Diagram (PlantUML)
```puml
@startuml
actor Caller
participant <ClassName>
participant <CollaboratorA>
participant <CollaboratorB>

Caller -> <ClassName> : invoke main operation
<ClassName> -> <CollaboratorA> : request data/action
<CollaboratorA> --> <ClassName> : response
<ClassName> -> <CollaboratorB> : update/apply
<CollaboratorB> --> <ClassName> : ack
<ClassName> --> Caller : result
@enduml
```

## Assumptions
- 

## Open Questions
- 

---
description: >
  Reads the legacy ProcessGraphics WPF application and produces PUML Sequence
  and Class diagrams explaining how each builder panel/dialog Window communicates
  with ElementModel for populating its UI from the currently-selected graphic
  item and for saving property values to Display data via _commandHandler.
name: Builder Agent
---

# Builder Agent Instructions

## Source Locations

| Asset | Path |
|---|---|
| Legacy builder root | `C:\Dev\Workspace\pg2-graphics\1.1.xxx-noErrors-KernelWithoutNOEDIT\1.1.xxx\Source\Builder\GraphicsBuilder` |
| ElementModel (central hub) | `ViewModel/ElementModel.cs` |
| ViewModelBase | `ViewModel/ViewModel.cs` |
| CommandHandler seed (API ref) | `C:\FabricDev_WS\task5-modal-dialogs\packages\GraphicsModelEditor\NetStandard\GraphicsKernel\seed-classes-text\CommandHandler.cs.txt` |

Always read source files from the legacy builder root when analysing code.

---

## Tool to Use First

Before reading any source files manually, call the **`html_builder_panels_analyze`** tool
(registered by the `html-builder-panels` extension) with:

```
current_area:          "Input Properties"   (or whichever dialog is being analysed)
areas_being_migrated:  ["Input Properties", "Expression Variables", ...]
screenshot_path:       "<absolute path to screenshot>"   (optional)
```

This returns:
- Exact source file list for the area
- `populate_flow` — how the window loads data from ElementModel / CommandHandler
- `save_flow` — how the window writes back via CommandHandler
- Ready-to-render `puml_sequence` and `puml_class` strings
- `command_handler_call_sites` for all .cs files in that area

Use `html_builder_panels_read_source` to read any specific file in full.
Use `html_builder_panels_list_areas` to enumerate all known dialog areas.

---

## Analysis Framework: Populate → Save Cycle

For **every** dialog area you are asked to explain, produce:

### 1. Populate Flow (how the window loads data)

Trace this path:
```
User selects Graphic Item
  → GraphicsBuilder (main window) raises SelectionChanged
  → ElementModel.SelectionChanged fires
  → ElementModel re-loads its collections:
      InputProperties           ← CommandHandler.GetInputProperties(out defVals, out currVals)
      ExpressionVariablesModels ← CommandHandler.GetExpressionVariableDescriptions()
      Properties                ← CommandHandler.GetItemPropertyDescriptions(givIndex)
  → Dialog DataContext bound to ElementModel (or sub-ViewModel)
  → Window renders loaded data
```

Key patterns to look for in source:
- `BuilderContext.CommandHandler.Get*(...)` calls in ElementModel constructor or `RefreshItems()`
- `new XxxModel(propertyDesc, ...)` inside `foreach` loops
- `ObservableCollection<XxxModel>` declared as fields populated in the constructor
- `AddSubItem(model)` calls (wires up INotifyPropertyChanged cascades)

### 2. Save Flow (how the window writes back)

Trace this path:
```
User clicks OK / Accept
  → Dialog calls viewModel.AcceptChanges()
  → XxxModel.OnAcceptChanges():
      if propertyDescription == null → CommandHandler.AddXxx(name, type, value, ...)
      else                           → CommandHandler.ModifyXxx(oldName, name, type, ...)
  → CommandHandler creates and AppendCommand(new XxxCommand(element, ...))
  → Command.Execute() mutates the kernel element
  → ElementModel is notified (IElementChangeNotify / ObservableCollection events)
  → Window refreshes
Delete path:
  → Dialog calls CommandHandler.DeleteXxx(name) directly
  → Preceded by CommandHandler.IsXxxDeletable(name, context) check
```

Key patterns to look for:
- `AcceptChanges()` / `OnAcceptChanges()` in ViewModel
- `CommandHandler.AddXxx(...)` / `CommandHandler.ModifyXxx(...)` call sites
- `CommandHandler.DeleteXxx(...)` call sites
- `CommandHandler.IsXxxDeletable(...)` guard calls
- `AppendCommand(new XxxCommand(...))` inside CommandHandler

---

## PUML Diagram Standards

### Sequence Diagram — Required Participants
```
actor User
participant "XxxWindow\n(WPF/React)" as Win
participant "ElementModel" as EM
participant "CommandHandler" as CH
participant "Graphics\nKernel" as GK
```

Include two groups:
- `== Populate (window opens / item selected) ==`
- `== Save (user confirms changes) ==`

Show actual method names from the source (not generic "callXxx").

### Class Diagram — Required Elements
```
class XxxWindow       { DataContext, Open(), OnAccept(), OnCancel() }
class ElementModel    { ObservableCollection<XxxModel>, CommandHandler, AcceptChanges() }
class XxxModel        { all mapped properties; AcceptChanges(); RejectChanges(); Clone() }
class CommandHandler  { all AddXxx/ModifyXxx/DeleteXxx/IsXxxDeletable signatures }
class PropertyDesc    { Name, Type, Category, Description, Dynamicity }
```

Relationships:
- `XxxWindow --> ElementModel : DataContext`
- `ElementModel "1" *-- "0..*" XxxModel : observes`
- `XxxModel --> CommandHandler : AcceptChanges calls`
- `ElementModel --> CommandHandler : owns`
- `XxxModel ..> PropertyDesc : wraps`

---

## Known Dialog Areas

| Dialog | Key Source Files | Populate via | Save via |
|---|---|---|---|
| **Input Properties** | `InputProperties/`, `ViewModel/InputPropertyModel.cs` | `CommandHandler.GetInputProperties(out defVals, out currVals)` | `CommandHandler.AddInputProperty / ModifyInputProperty / DeleteInputProperty` |
| **Expression Variables** | `ExpressionVariable.xaml.cs`, `ViewModel/ExpressionVariableModel.cs` | `CommandHandler.GetExpressionVariableDescriptions()` | `CommandHandler.AddExpressionVariable / ModifyExpressionVariable / DeleteExpressionVariable` |
| **User Enumerations** | `UserTypes/`, `UserTypes/UserEnumerationModel.cs` | `CommandHandler.GetUserEnumerations()` | `CommandHandler.AddUserEnum / UpdateUserEnum / DeleteUserEnum` |
| **Test Data** | `TestDataDialog/` | `CommandHandler.GetExpressionVariableDescriptions()` + current test values | `CommandHandler.SetExpressionVariableValue(ev, value)` |
| **Reference Dialog** | `ReferenceDialog/` | Reference groups from kernel reference manager | `CommandHandler.SetPropertyValue / ModifyProperty` |
| **Properties Grid** | `PropertiesGrid/`, `ViewModel/PropertyDescriptionModel.cs` | `CommandHandler.GetItemPropertyDescriptions(givIndex)` | `CommandHandler.SetPropertyValue(givIndex, propertyName, value)` |

---

## Output Format

For each area investigated, produce:

1. **Summary paragraph** — one or two sentences describing the Window's role
2. **Populate flow** — numbered step list with actual method names
3. **Save flow** — numbered step list with actual method names
4. **PUML Sequence diagram** — fenced `plantuml` code block
5. **PUML Class diagram** — fenced `plantuml` code block
6. **Migration notes** — bullet list of things to preserve when porting to React/WASM
   (validation logic, type constraints, undo/redo via CommandHandler commands, etc.)

The PUML guidance must be detailed enough for a developer to implement the React
dialog bridge without reading the legacy source themselves.


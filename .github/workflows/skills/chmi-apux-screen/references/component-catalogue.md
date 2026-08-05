# APUX Component Catalogue

Sourced from `packages/apux-storybook/stories/` and `packages/apux-react/src/`.

---

## Button — `<apux-button>` / `Button`

```tsx
import { Button } from '../../../packages/apux-react/src/components/button';

<Button variant="primary" icon="plus" size="medium">Save</Button>
<Button variant="ghost" disabled>Cancel</Button>
<Button variant="danger" icon="trash">Delete</Button>
```

**Props**: `variant` (`primary` | `secondary` | `ghost` | `danger`), `size` (`small` | `medium` | `large`), `icon` (icon name string), `disabled`, `block`, `type`, `name`, `value`

Story: `packages/apux-storybook/stories/button/button.stories.ts`

---

## Input — `<apux-input>` / `Input`

```tsx
import { Input } from '../../../packages/apux-react/src/components/input';

<Input placeholder="Enter value" icon="search" size="small" />
<Input type="number" min={0} max={100} value="50" />
```

**Props**: `value`, `placeholder`, `type` (`text` | `number` | `password`), `icon`, `size`, `disabled`, `block`, `prefix`, `suffix`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `required`, `name`

Story: `packages/apux-storybook/stories/input/input.stories.ts`

---

## Card — `<apux-card>` / `Card`

```tsx
import { Card } from '../../../packages/apux-react/src/components/card';

<Card selected={false}>
  <p>Any content here</p>
</Card>
```

**Props**: `selected` (boolean — adds outline)

Story: `packages/apux-storybook/stories/card/card.stories.ts`

---

## Accordion + Details — `<apux-accordion>` + `<apux-details>`

```tsx
import { Accordion } from '../../../packages/apux-react/src/components/accordion';
import { Details } from '../../../packages/apux-react/src/components/details';

<Accordion multiple={false}>
  <Details open>
    <div slot="summary">Section One</div>
    Content for section one.
  </Details>
  <Details>
    <div slot="summary">Section Two</div>
    Content for section two.
  </Details>
</Accordion>
```

**Accordion props**: `multiple` (boolean)
**Details props**: `open` (boolean), slot `summary` for header text

Story: `packages/apux-storybook/stories/details/accordion.stories.ts`

---

## Dialog — `<apux-dialog>` / `Dialog`

```tsx
import { Dialog } from '../../../packages/apux-react/src/components/dialog';
import { Button } from '../../../packages/apux-react/src/components/button';

<Dialog opened={open} modal header="Confirm" state="default"
  onClose={() => setOpen(false)}>
  Are you sure you want to proceed?
  <div slot="actions">
    <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
  </div>
</Dialog>
```

**Props**: `opened`, `modal`, `header`, `state` (`default` | `error`), `onClose`
**Slots**: default (content), `actions` (button bar)

Story: `packages/apux-storybook/stories/dialog/dialog.stories.ts`

---

## Select + Option — `<apux-select>` + `<apux-option>` / `Select` + `Option`

```tsx
import { Select } from '../../../packages/apux-react/src/components/select';
import { Option } from '../../../packages/apux-react/src/components/option';

<Select placeholder="Choose..." value={val} onApuxChange={(e) => setVal(e.detail)}>
  <Option value="a">Alpha</Option>
  <Option value="b">Beta</Option>
</Select>
```

Story: `packages/apux-storybook/stories/select/select.stories.ts`

---

## Tooltip — `<apux-tooltip>` / `Tooltip`

```tsx
import { Tooltip } from '../../../packages/apux-react/src/components/tooltip';

<Tooltip content="This is helpful text" position="top">
  <apux-button>Hover me</apux-button>
</Tooltip>
```

Story: `packages/apux-storybook/stories/tooltip/tooltip.stories.ts`

---

## Tag — `<apux-tag>` / `Tag`

```tsx
import { Tag } from '../../../packages/apux-react/src/components/tag';

<Tag closeable>Running</Tag>
<Tag disabled>Inactive</Tag>
```

**Props**: `closeable`, `disabled`, `line`

Story: `packages/apux-storybook/stories/tag/tag.stories.ts`

---

## Status — `<apux-status>` / `Status`

```tsx
import { Status } from '../../../packages/apux-react/src/components/status';

<Status type="success">OK</Status>
<Status type="error">Failed</Status>
<Status type="warning">Warning</Status>
<Status type="info">Info</Status>
```

Story: `packages/apux-storybook/stories/status/status.stories.ts`

---

## Icon — `<apux-icon>` / `Icon`

```tsx
import { Icon } from '../../../packages/apux-react/src/components/icon';

<Icon name="plus" size="medium" />
<Icon name="trash" />
```

**Props**: `name` (icon name string), `size`

Story: `packages/apux-storybook/stories/icon/icon.stories.ts`

---

## Toggle Button — `<apux-toggle-button>` / `ToggleButton`

```tsx
import { ToggleButton } from '../../../packages/apux-react/src/components/toggle-button';

<ToggleButton pressed icon="star">Favourite</ToggleButton>
```

Story: `packages/apux-storybook/stories/toggle-button/toggle-button.stories.ts`

---

## Switch — `<apux-switch>` / `Switch`

```tsx
import { Switch } from '../../../packages/apux-react/src/components/switch';

<Switch checked={enabled} onApuxChange={(e) => setEnabled(e.detail)}>
  Enable feature
</Switch>
```

Story: `packages/apux-storybook/stories/switch/switch.stories.ts`

---

## Checkbox — `<apux-checkbox>` / `Checkbox`

```tsx
import { Checkbox } from '../../../packages/apux-react/src/components/checkbox';

<Checkbox checked={val} onApuxChange={(e) => setVal(e.detail)}>Accept terms</Checkbox>
```

Story: `packages/apux-storybook/stories/checkbox/checkbox.stories.ts`

---

## Radio + RadioGroup — `<apux-radio>`

```tsx
import { Radio } from '../../../packages/apux-react/src/components/radio';

<fieldset>
  <Radio name="size" value="s">Small</Radio>
  <Radio name="size" value="m" checked>Medium</Radio>
  <Radio name="size" value="l">Large</Radio>
</fieldset>
```

Story: `packages/apux-storybook/stories/radio/radio.stories.ts`

---

## Textarea — `<apux-textarea>` / `Textarea`

```tsx
import { Textarea } from '../../../packages/apux-react/src/components/textarea';

<Textarea placeholder="Enter notes..." rows={4} block />
```

Story: `packages/apux-storybook/stories/textarea/textarea.stories.ts`

---

## Tree View — `<apux-tree-view>` / `TreeView`

```tsx
import { TreeView } from '../../../packages/apux-react/src/components/tree-view';

<TreeView selection="row" multiple search searchPlaceHolder="Filter...">
  <apux-tree-view-item>Root Item
    <apux-tree-view-item slot="children">Child A</apux-tree-view-item>
    <apux-tree-view-item slot="children">Child B</apux-tree-view-item>
  </apux-tree-view-item>
</TreeView>
```

**Props**: `selection` (`row` | `checkbox`), `multiple`, `search`, `searchPlaceHolder`, `size`

Story: `packages/apux-storybook/stories/tree-view/tree-view.stories.ts`

---

## Tab / TabList — `<apux-tab>` + `<apux-tab-list>`

```tsx
import { TabList } from '../../../packages/apux-react/src/components/tab-list';
import { Tab } from '../../../packages/apux-react/src/components/tab';

<TabList>
  <Tab selected>Overview</Tab>
  <Tab>Details</Tab>
  <Tab disabled>History</Tab>
</TabList>
```

Story: `packages/apux-storybook/stories/tab/tab.stories.ts`

---

## Menu / MenuItem — web-component only (no React wrapper)

```tsx
import React, { useRef, useEffect } from 'react';

export default function MyScreen() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.addEventListener('apux-select', (e: any) => console.log(e.detail));
  }, []);
  return (
    <apux-menu ref={ref as any} size="medium">
      <apux-menu-header>Actions</apux-menu-header>
      <apux-menu-item>Open</apux-menu-item>
      <apux-menu-item>Save</apux-menu-item>
      <apux-divider />
      <apux-menu-item disabled>Delete</apux-menu-item>
    </apux-menu>
  );
}
```

Story: `packages/apux-storybook/stories/menu/menu.stories.ts`

---

## Field — `<apux-field>` / `Field` (form label wrapper)

```tsx
import { Field } from '../../../packages/apux-react/src/components/field';
import { Input } from '../../../packages/apux-react/src/components/input';

<Field label="Username" description="Must be unique">
  <Input placeholder="Enter username" name="user" required />
</Field>
```

---

## Breadcrumbs — `<apux-breadcrumbs>` / `Breadcrumbs`

```tsx
import { Breadcrumbs } from '../../../packages/apux-react/src/components/breadcrumbs';
import { Breadcrumb } from '../../../packages/apux-react/src/components/breadcrumb';

<Breadcrumbs>
  <Breadcrumb href="/">Home</Breadcrumb>
  <Breadcrumb href="/settings">Settings</Breadcrumb>
  <Breadcrumb>Current Page</Breadcrumb>
</Breadcrumbs>
```

Story: `packages/apux-storybook/stories/breadcrumbs/breadcrumbs.stories.ts`

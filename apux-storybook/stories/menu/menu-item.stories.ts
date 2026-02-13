import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { iconNames } from "@abb-hmi/apux/types";
import { Item } from "./common.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxMenuItem & { Default: string; submenu: { label: string }[] };

/**
 * Menu item `apux-menu-item` is an arbitrary hierarchy structure,
 * it can also be represented as nested menu items.
 */
const meta = {
  title: "General/Menu/Item",
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      name: "disabled",
      control: "boolean",
      type: "boolean",
      description: "Prevents user interaction",
    },
    icon: {
      name: "icon",
      control: { type: "select" },
      options: [...iconNames],
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed as part of the menu item",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the item, can be text or HTML",
    },
    href: {
      type: "string",
      description: "Used for navigating to a specific page",
    },
    selected: {
      type: "boolean",
      description: "It is the initial selection state",
    },
    multiselect: {
      type: "boolean",
      description:
        "Changes the way the menu item is displayed by adding a checkbox",
    },
    click: {
      table: { category: "Events" },
      description: "Fires when the user clicks on menu item",
      type: { name: "function" },
    },
  },
  render({ Default, selected, disabled, icon, href, submenu, multiselect }) {
    return html`<apux-menu>
      <apux-menu-item
        ?selected=${selected}
        ?disabled="${disabled}"
        ?multiselect=${multiselect}
        icon=${ifDefined(icon)}
        href=${ifDefined(href)}
        >${unsafeHTML(Default)}
        ${submenu &&
        html`<apux-menu>
          ${submenu.map(
            ({ label }: Item) =>
              html`<apux-menu-item>${unsafeHTML(label)}</apux-menu-item>`
          )}</apux-menu
        >`}</apux-menu-item
      >
    </apux-menu>`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    Default: "Edit",
    submenu: [{ label: "Cut" }, { label: "Copy" }, { label: "Paste" }],
  },
};

export const Selected: Story = {
  args: {
    Default: "File",
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    Default: "File",
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    Default: "File",
    icon: "document",
  },
};

export const Hyperlink: Story = {
  args: {
    Default: "File",
    href: "#",
  },
};

export const Nested: Story = {
  args: {
    Default: "Edit",
    submenu: [{ label: "Cut" }, { label: "Copy" }, { label: "Paste" }],
  },
};

export const Multiselect: Story = {
  render() {
    const clickListener = function (this: ApuxMenuItem) {
      this.selected = !this.selected;
    };
    return html`<div style="display:flex; flex-direction: column;">
      <apux-menu
        ><apux-menu-item multiselect @click="${clickListener}"
          >Tools</apux-menu-item
        >
        <apux-menu-item multiselect selected @click="${clickListener}"
          >Tools 2</apux-menu-item
        ></apux-menu
      >
    </div>`;
  },
};

/**
 * Below is just an example of selecting menu item with a click.
 * **This is not the default behavior** but one of the possibilities.
 */
export const SelectItem: Story = {
  name: "Select item",
  render() {
    const clickListener = function (this: ApuxMenuItem) {
      this.selected = !this.selected;
    };
    return html` <div style="display:flex; flex-direction: column;">
      <apux-menu
        ><apux-menu-item @click="${clickListener}"
          >Help</apux-menu-item
        ></apux-menu
      >
      <apux-menu
        ><apux-menu-item multiselect @click="${clickListener}"
          >Tools</apux-menu-item
        ></apux-menu
      >
    </div>`;
  },
  parameters: {
    actions: {
      handles: ["click"],
    },
  },
};

export const Events: Story = {
  args: {
    Default: "Edit",
  },
  parameters: {
    actions: {
      handles: ["click"],
    },
  },
};

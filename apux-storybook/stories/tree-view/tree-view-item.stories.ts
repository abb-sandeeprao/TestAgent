import { iconNames } from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxTreeViewItem & {
  Default: string;
  toggle: never;
  textSlot: string;
  change: never;
};

/**
 * A tree item is a node in the tree. Each item can contain a sub-level group
 * of elements that can be expanded or collapsed.
 *
 * In case that an item has nested items, its nested elements can expanded
 * or collapsed (hiding or displaying them).
 */
const meta = {
  title: "General/Tree view/Tree item",
  tags: ["autodocs"],
  argTypes: {
    text: {
      type: "string",
      description:
        "The information displayed on the tooltip as text if the slot is empty",
    },
    icon: {
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed as part of the input",
    },
    disabled: {
      name: "disabled",
      type: "boolean",
      description: "Prevents user interaction",
    },
    open: {
      type: "boolean",
      description: "Wether item can be opened or closed",
    },
    click: {
      table: { category: "Events" },
      description:
        "fires when a pointing device button is both pressed and released",
      type: { name: "function" },
    },
    toggle: {
      table: { category: "Events" },
      description: "fires when the item gets either expanded or collapsed",
      type: { name: "function" },
    },
    Default: {
      table: { category: "Slots" },
      type: "string",
      description:
        "Any content for the tree item, can be text or HTML, it can used for extra visual content",
    },
    textSlot: {
      table: { category: "Slots" },
      name: "text",
      type: "string",
      description:
        "The same as the default slot, but replacing the text set as attribute instead of appending",
    },
    change: {
      table: { category: "Events" },
      description: "fires when the item gets either selected or unselected",
      type: { name: "function" },
    },
  },
  render({ icon, Default, textSlot, open, text, disabled }) {
    const textDiv = textSlot
      ? html`<div slot="text">${unsafeHTML(textSlot)}</div>`
      : null;
    return html`<apux-tree-view-item
      .icon=${icon}
      ?open=${open}
      ?disabled=${disabled}
      text=${ifDefined(text)}
    >
      ${unsafeHTML(Default)}${textDiv}
    </apux-tree-view-item>`;
  },
  parameters: {
    actions: {
      handles: ["click apux-tree-view-item", "toggle", "change"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    text: "Land",
  },
};

export const WithIcon: Story = {
  args: {
    Default: "Wind",
    icon: "folder",
  },
};

export const WithLinks: Story = {
  args: {
    Default: `Asia<apux-tree-view-item open><a href="https://global.abb" target="__blank">ABB Global</a>
  <apux-tree-view-item>Process automation</apux-tree-view-item></apux-tree-view-item>`,
    open: true,
  },
};

export const RichContent: Story = {
  args: {
    Default: "<em>India</em>&nbsp;is in Asia",
  },
};

export const NestedItems: Story = {
  args: {
    text: "Continents",
    Default: `
  <apux-tree-view-item text="Europe">
    <apux-tree-view-item text="Spain"></apux-tree-view-item>
  </apux-tree-view-item>
  <apux-tree-view-item text="Asia">
    <apux-tree-view-item text="India"></apux-tree-view-item>
  </apux-tree-view-item>`,
    open: true,
  },
};

export const DisabledItem: Story = {
  args: {
    text: "Continents",
    Default: `
  <apux-tree-view-item text="Europe" disabled>
    <apux-tree-view-item text="Spain"></apux-tree-view-item>
  </apux-tree-view-item>`,
    open: true,
  },
};

/**
 * A tree item can contain a child element bigger than the default height.
 * The expander of the element will be centered vertically in respect of
 * the height of the child element.
 */
export const RichContentBigger: Story = {
  name: "Rich Content (Bigger element)",
  args: {
    text: "Slotted content",
    Default: `
  <apux-tree-view-item><apux-card style="width:100%; height:4rem; display:flex; align-items:center">It is courage, courage, courage, that raises the blood of life to crimson splendor. Live bravely and present a brave front to adversity.</apux-card>
    <apux-tree-view-item><apux-card style="width:100%; height:4rem; display:flex; align-items:center" >You have brains in your head. You have feet in your shoes. You can steer yourself in any direction you choose. You're on your own, and you know what you know. And you are the guy who'll decide where to go.</apux-card></apux-tree-view-item>
  </apux-tree-view-item>
  <apux-tree-view-item><apux-card style="width:100%; height:4rem; display:flex; align-items:center">Coming together is a beginning; keeping together is progress; working together is success.</apux-card>
    <apux-tree-view-item><apux-card style="width:100%; height:4rem; display:flex; align-items:center">In order to carry a positive action we must develop here a positive vision.2</apux-card></apux-tree-view-item>
  </apux-tree-view-item>`,
    open: true,
  },
};

export const Events: Story = {
  render(args) {
    return html`<apux-tree-view selection="checkbox"
      >${meta.render(args)}</apux-tree-view
    >`;
  },
  args: {
    text: "Berries",
    Default: "<apux-tree-view-item>Blueberries</apux-tree-view-item>",
  },
};

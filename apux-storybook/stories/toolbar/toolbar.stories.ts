import { StoryObj, Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { ApuxToolbar } from "../../../apux/src/components/toolbar";

type Args = ApuxToolbar & { Default: string; change: never; close: never };

export const toolbarElementsExample = `<apux-button icon="plus" variant="discreet" size="extra-small">Add</apux-button>
    <apux-button icon="minus" variant="discreet" size="extra-small">Remove</apux-button>
    <apux-divider></apux-divider>
    <apux-button icon="view" variant="discreet" size="extra-small"></apux-button>
    <apux-button icon="triangle-left" variant="discreet" size="extra-small"></apux-button>
    <apux-button icon="triangle-right" variant="discreet" size="extra-small"></apux-button>
    <apux-button icon="turn-counter-clockwise" variant="discreet" size="extra-small"></apux-button>
    <apux-button icon="pause" variant="discreet" size="extra-small"></apux-button>
    <apux-button icon="more" variant="discreet" size="extra-small"></apux-button>
    <apux-divider></apux-divider>
    <apux-input type="datetime-local" size="small"></apux-input>
    <apux-switch variant="discreet" size="small">Enable</apux-switch>
    <apux-button icon="send" variant="discreet" size="extra-small">Send</apux-button>`;

/**
 * Toolbar is used to group a set of controls, such as buttons, inputs, and switches,
 * typically placed at the top of an application interface for easy access to common actions.
 */
const meta = {
  title: "General/Toolbar",
  tags: ["autodocs"],
  excludeStories: ["toolbarElementsExample"],
  argTypes: {
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the toolbar, can be text or HTML",
    },
  },
  render: ({ Default }) => {
    return html`<apux-toolbar>${unsafeHTML(Default)}</apux-toolbar>`;
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export default meta;

/**
 * It is responsiveness, which means its descendants will jump to the next line when there is no enough space.
 *
 * The divider `apux-divider` inside the toolbar will automatically set its `vertical` attribute.
 *
 * ***It is not recommended to put too big elements inside the toolbar, as it may affect the layout and responsiveness***.
 */
export const Default: Story = {
  args: {
    Default: toolbarElementsExample,
  },
};

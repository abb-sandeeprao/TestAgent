import { states } from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxStatus & { Default: string };

/**
 * Status component is used to indicate status or result of a task or operation
 * or the validity of user input, or in general any admonition.
 * It is displayed in four possible states: Success, Info, Warning and Error `(it shouldn't be used to display messages)`.
 */
const meta = {
  title: "General/Status",
  tags: ["autodocs"],
  argTypes: {
    block: {
      name: "block",
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Displays as a block element",
    },
    state: {
      type: {
        name: "enum",
        value: [...states],
      },
      description: "Set one of the state of status",
      default: "success",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the status, can be text or HTML",
    },
  },
  render({ block, Default, state }) {
    return html`<apux-status ?block=${block} .state=${state}
      >${unsafeHTML(Default)}</apux-status
    >`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const DefaultState: Story = {
  name: "State: Success",
  args: {
    Default: "Running",
    block: false,
    state: "success",
  },
};

export const InfoState: Story = {
  name: "State: Info",
  args: {
    Default: "Experimental",
    block: false,
    state: "info",
  },
};

export const WarningState: Story = {
  name: "State: Warning",
  args: {
    Default: "Unresolved",
    block: false,
    state: "warning",
  },
};

export const ErrState: Story = {
  name: "State: Error",
  args: {
    Default: "Rejected",
    block: false,
    state: "error",
  },
};

export const Block: Story = {
  args: {
    Default: "Active",
    block: true,
    state: "success",
  },
};

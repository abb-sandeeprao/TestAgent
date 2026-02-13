import { iconNames } from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxSegment & { Default: string; change: never };

/**
 * A segment is a distinct option, typically displayed as a separate button,
 * only one segment can be active or selected at any given moment.
 */
const meta = {
  title: "Form/Segment Control/Segment",
  tags: ["autodocs"],
  argTypes: {
    icon: {
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed in segment button",
    },
    name: {
      type: "string",
      description:
        "Name of the segment, submitted as key/pair with the `value`",
    },
    selected: {
      type: "boolean",
      description: "Whether the segment button is currently selected",
    },
    value: {
      type: "string",
      description: "Value associated to the segment's `name`",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Any content/label for the segment button, can be text or HTML",
    },
    click: {
      table: { category: "Events" },
      description: "Fires when the user clicks on the segment button",
      type: { name: "function" },
    },
    change: {
      table: { category: "Events" },
      description: "Fires when new segment is clicked by user",
      type: { name: "function" },
    },
  },
  render({ Default, icon, disabled, value, name, selected }) {
    return html` <apux-segment-control>
      <apux-segment
        .icon=${icon}
        .name=${name}
        ?selected="${selected}"
        .value=${value}
        ?disabled=${disabled}
        >${unsafeHTML(Default)}</apux-segment
      >
    </apux-segment-control>`;
  },
  parameters: {
    actions: {
      handles: ["change", "click"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    Default: "Battery Low",
    icon: "battery-low",
  },
};

export const Selected: Story = {
  args: {
    Default: "Temperature",
    icon: "temperature",
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    Default: "Tree view",
    icon: "tree-view",
    disabled: true,
  },
};

export const DisabledSelected: Story = {
  name: "Disabled(Selected)",
  args: {
    Default: "Show Items",
    icon: "view",
    disabled: true,
    selected: true,
  },
};

export const Label: Story = {
  args: {
    Default: "Orange",
    selected: true,
  },
};

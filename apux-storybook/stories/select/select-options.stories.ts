import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { continentOptions, Item } from "./common.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxOption & { Default: string };

/**
 * Options to be displayed under a dropdown.
 */
const meta = {
  title: "Form/Select/Options",
  tags: ["autodocs"],
  argTypes: {
    selected: {
      type: "boolean",
      description: "Whether the option is currently selected",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    value: {
      type: "string",
      description: "Value associated to the option",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the option, can be text or HTML",
    },
  },
  render({ selected, Default, value, disabled }) {
    return html`<apux-select placeholder="Select an option">
      <apux-option
        value=${value}
        ?selected="${selected}"
        ?disabled="${disabled}"
        >${unsafeHTML(Default)}</apux-option
      >
      ${continentOptions.map(
        ({ value, content, selected }: Item) =>
          html`<apux-option ?selected=${selected} value="${value}"
            >${content}</apux-option
          >`
      )}</apux-select
    >`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const OptionSelected: Story = {
  args: {
    value: "lemuria",
    Default: "Lemuria",
    selected: true,
  },
};

export const OptionUnselected: Story = {
  args: {
    value: "lemuria",
    Default: "Lemuria",
    selected: false,
  },
};

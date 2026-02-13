import { componentSizes, iconNames, toggleVariants } from "@abb-hmi/apux/types";
import { actions } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { clearItem } from "../../utils/args.js";

type Args = ApuxToggleButton & { Default: string };

/**
 * A toggle button allows the user to change a setting between two states.
 * It implies that there are only two possible options and that a user is
 * switching between them, and usually these options are on or off for
 * a specific preference.
 */
const meta = {
  title: "Form/Toggle Button",
  tags: ["autodocs"],
  argTypes: {
    icon: {
      name: "icon",
      control: { type: "select" },
      options: [clearItem, ...iconNames],
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be toggled as button",
    },
    variant: {
      type: { name: "enum", value: [...toggleVariants] },
      description: "Stylistic variation to emphasize the element",
    },
    size: {
      description: `Vertical size of the toggle button`,
      type: {
        name: "enum",
        value: [...componentSizes],
      },
    },
    name: {
      type: "string",
      description: "Name of the toggle, submitted as key/pair with the `value`",
    },
    checked: {
      type: "boolean",
      description: "Whether or not this toggle is checked by default",
    },
    value: {
      type: "string",
      description: "Value associated to the toggle's `name`",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    block: {
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Displays as a block element",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Any content/label for the toggle button, can be text or HTML",
    },
  },
  render({
    icon,
    checked,
    name,
    value,
    disabled,
    variant,
    size,
    Default,
    block,
  }) {
    return html`<apux-toggle-button
      .icon=${icon}
      ?checked=${checked}
      ?block=${block}
      .name=${name}
      .value=${value}
      ?disabled=${disabled}
      .variant=${variant}
      .size=${size}
      >${unsafeHTML(Default)}</apux-toggle-button
    >`;
  },
  parameters: {
    actions: {
      handles: ["change", "click apux-toggle-button"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: { Default: "Battery" },
};

export const Iconic: Story = {
  args: { icon: "plus" },
};

export const Checked: Story = {
  args: { checked: true, icon: "plus" },
};

export const Disabled: Story = {
  args: { disabled: true, icon: "not-allowed" },
};

export const Small: Story = {
  args: { size: "small", icon: "broadcast" },
};

export const Block: Story = {
  args: { block: true, icon: "broadcast" },
};

export const VariantDiscreet: Story = {
  name: "Variant: Discreet",
  args: {
    variant: "discreet",
    icon: "sun-2",
    checked: true,
  },
};

export const Label: Story = {
  args: {
    Default: "Battery saving mode",
    checked: true,
  },
};

export const WithIcon: Story = {
  args: {
    Default: "Turn on bluetooth",
    icon: "bluetooth",
  },
};

export const WithTooltip: Story = {
  render(args) {
    return html`<apux-tooltip text="Enable bluetooth" placement="right"
      >${meta.render(args)}</apux-tooltip
    >`;
  },
  args: { icon: "bluetooth", title: "Enable bluetooth" },
};

const events = actions("onClick", "onSubmit");

export const FormIntegration: Story = {
  render(args) {
    const submit = (ev: SubmitEvent) => {
      ev.preventDefault();
      const params = new URLSearchParams(
        new FormData(ev.currentTarget as HTMLFormElement) as unknown as Record<
          string,
          string
        >,
      );
      events.onSubmit(ev, params.toString());
    };
    return html`<form @submit=${submit}>
      ${meta.render(args)} Others:
      <apux-toggle-button name=${args.name} value="audio" icon="audio-on"
        >Audio</apux-toggle-button
      >
      <apux-toggle-button
        name=${args.name}
        value="light"
        icon="sun"
      ></apux-toggle-button>
    </form>`;
  },
  args: {
    checked: true,
    icon: "plus",
    name: "modifier",
    value: "plus",
  },
};

export const Events: Story = {
  args: { icon: "wrench" },
};

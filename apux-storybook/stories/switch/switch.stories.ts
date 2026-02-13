import { actions } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = Partial<ApuxSwitch> & { Default: string; change: never };

/**
 * Allow the user to take a binary decision, this component is used mainly
 * for confirmation.
 */
const meta = {
  title: "Form/Switch",
  tags: ["autodocs"],
  argTypes: {
    name: {
      type: "string",
      description: "Name of the switch, submitted as key/pair with the `value`",
    },
    checked: {
      type: "boolean",
      description: "Whether or not this switch is checked by default",
    },
    value: {
      type: "string",
      description: "Value associated to the switch's `name`",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    change: {
      table: { category: "Events" },
      description:
        "fires when the `value` of the control has been modified by the user",
      type: { name: "function" },
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the switch, can be text or HTML",
    },
  },
  render({ Default, checked, disabled, name, value }) {
    return html`<apux-switch
      ?checked=${checked}
      ?disabled=${disabled}
      .name=${name}
      .value=${value}
      >${unsafeHTML(Default)}</apux-switch
    >`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const BasicChecked: Story = {
  args: {
    Default: "Lettuce",
    checked: true,
  },
};

export const BasicUnchecked: Story = {
  args: {
    Default: "Lettuce",
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    Default: "Olive",
    disabled: true,
  },
};

export const NoLabel: Story = {
  render: (args) =>
    html`${meta.render(args)}${meta.render({
      ...args,
      checked: false,
    })}${meta.render({
      ...args,
      checked: true,
    })}`,
};
NoLabel.args = { checked: true };

const events = actions("onSubmit");

export const FormIntegration: Story = {
  render(args) {
    const submit = function (this: HTMLFormElement, event: SubmitEvent) {
      event.preventDefault();
      const data = new FormData(this);
      const params = new URLSearchParams(
        data as unknown as undefined,
      ).toString();
      events.onSubmit({ event, params });
    };
    return html`<form @submit=${submit}>
      <strong>Select an element and press enter to submit</strong>
      <div>${meta.render(args)}</div>
      <div>${meta.render({ ...args, Default: "Garlic", value: "garlic" })}</div>
      <div>
        ${meta.render({ ...args, Default: "Jalapeño", value: "jalapeno" })}
      </div>
      <div>
        ${meta.render({
          ...args,
          Default: "Tomato",
          value: "tomato",
          checked: false,
        })}
      </div>
    </form>`;
  },
  args: {
    Default: "Onion",
    name: "ingredients",
    value: "pepperoni",
    checked: true,
  },
};

export const Events: Story = {
  args: {
    Default: "Tomato",
  },
  parameters: {
    actions: {
      handles: ["change", "click apux-switch"],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const apuxSwitch = canvas.getByRole("checkbox");
    userEvent.click(apuxSwitch);
  },
};

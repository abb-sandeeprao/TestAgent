import { actions } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = Partial<ApuxCheckbox> & { Default: string; change: never };

/**
 * Allow the user to take a binary decision, this component is used mainly
 * for confirmation.
 */
const meta = {
  title: "Form/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    name: {
      type: "string",
      description:
        "Name of the checkbox, submitted as key/pair with the `value`",
    },
    checked: {
      type: "boolean",
      description: "Whether or not this checkbox is checked by default",
    },
    value: {
      type: "string",
      description: "Value associated to the checkbox's `name`",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    indeterminate: {
      type: { name: "boolean" },
      description: "Allows to set 3rd state of checkbox named indeterminate",
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
      description: "Any content/label for the checkbox, can be text or HTML",
    },
  },
  render({ Default, checked, disabled, name, value, indeterminate, variant }) {
    return html`<apux-checkbox
      ?checked=${checked}
      ?disabled=${disabled}
      .variant=${variant}
      .name=${name}
      .value=${value}
      .indeterminate=${indeterminate}
      >${unsafeHTML(Default)}</apux-checkbox
    >`;
  },
  parameters: {
    actions: {
      handles: ["change", "click apux-checkbox"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const BasicChecked: Story = {
  args: {
    Default: "Pepperoni",
    checked: true,
  },
};

export const BasicUnchecked: Story = {
  args: {
    Default: "Pepperoni",
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    Default: "Tuna",
    disabled: true,
  },
};

/**
 * The indeterminate state is not a boolean value, it is a third state
 * that can be set on the checkbox.<br>
 * It is used to indicate that the
 * checkbox is neither checked nor unchecked.<br>
 * This property is not reflected as an HTML attribute and
 * must be set programmatically.
 */
export const Indeterminate: Story = {
  args: {
    Default: "Fresh garlic",
    indeterminate: true,
  },
};

export const NoLabel: Story = {
  render: (args) =>
    html`${meta.render(args)}${meta.render({
      ...args,
      checked: false,
    })}${meta.render({ ...args, checked: true })}`,
  args: { checked: true },
};

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
      <div>
        ${meta.render({ ...args, Default: "Mozzarella", value: "mozzarella" })}
      </div>
      <div>
        ${meta.render({ ...args, Default: "Jalapeño", value: "jalapeno" })}
      </div>
      <div>
        ${meta.render({
          ...args,
          Default: "Salami",
          value: "salami",
          checked: false,
          indeterminate: true,
        })}
      </div>
    </form>`;
  },
  args: {
    Default: "Pepperoni",
    name: "ingredients",
    value: "pepperoni",
    checked: true,
  },
};

export const Events: Story = {
  args: {
    Default: "Tomato",
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    userEvent.click(checkbox);
  },
};

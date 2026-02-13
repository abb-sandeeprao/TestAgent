import { actions } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";

type Args = Partial<ApuxTextArea> & {
  Default: string;
  input: never;
  change: never;
};

/**
 * Textarea represents a multi-line plain-text editing control, that allows us
 * to enter a sizeable amount of free-form text, for example a comment on
 * a review or feedback form.
 */
const meta = {
  title: "Form/Textarea",
  tags: ["autodocs"],
  argTypes: {
    name: {
      type: "string",
      description:
        "Name of the textarea, submitted as key/pair with the `value`",
    },
    value: {
      type: "string",
      description: "Value associated to the textarea's `name`",
    },
    rows: {
      type: "number",
      description: "Sets number of rows",
    },
    cols: {
      type: "number",
      description: "Sets number of cols",
    },
    label: {
      type: "string",
      description:
        "**DEPRECATED** Displayed text next the control to indicate its purpose, use `<apux-field>`",
    },
    description: {
      type: "string",
      description:
        "**DEPRECATED** Displayed text under the control to instruct about its purpose, use `<apux-field>`",
    },
    placeholder: {
      type: "string",
      description:
        "Displayed text in the control when there is no value introduced",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    required: {
      type: "boolean",
      description:
        "It's value is required, makes a form non-submittable if not provided",
    },
    block: {
      name: "block",
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Displays as a block element",
    },
    input: {
      table: { category: "Events" },
      description:
        "fires when the `value` of the control has been changed after each change",
      type: { name: "function" },
    },
    change: {
      table: { category: "Events" },
      description:
        "fires when the `value` of the control has been modified by the user",
      type: { name: "function" },
    },
  },
  render({
    name,
    value,
    placeholder,
    label,
    description,
    disabled,
    rows,
    cols,
    block,
    required,
  }) {
    return html`<apux-textarea
      .name=${name}
      .value=${value}
      .rows=${rows}
      .cols=${cols}
      .block=${block}
      .placeholder=${placeholder}
      .label=${label}
      .description=${description}
      ?disabled=${disabled}
      ?required=${required}
    >
    </apux-textarea>`;
  },
  parameters: {
    actions: {
      handles: ["input", "change"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Textual: Story = {
  args: {
    placeholder: "Query",
    value: "This a sample query for Apux team",
  },
};

export const Placeholder: Story = {
  args: { placeholder: "Your feedback" },
};

export const Disabled: Story = {
  args: {
    placeholder: "You cannot write here",
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: "Something must be written here",
    required: true,
  },
};

export const Block: Story = {
  args: {
    placeholder: "Blocky blocks!",
    block: true,
  },
};

const events = actions("onSubmit");

/**
 * The value is passed to the form values, submit by button press.
 */
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
      <div>${meta.render(args)}</div>
      <div>
        <apux-button variant="primary">Submit</apux-button>
      </div>
    </form>`;
  },
  args: {
    placeholder: "Enter your feedback",
    value: "APUX is making my developer's life easier, thank you",
    required: true,
    name: "user-feedback",
  },
};

export const Events: Story = {
  args: {
    placeholder: "Enter your feedback",
    name: "user-feedback",
  },
};

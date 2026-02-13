import { actions } from "@storybook/addon-actions";
import { StoryObj, Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import {
  buttonSizes,
  buttonVariants,
  iconNames,
} from "../../../apux/src/types.js";
import { userEvent, within } from "@storybook/testing-library";
import { clearItem } from "../../utils/args.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxButton & { Default: string };

/**
 * A button is an interactive element used to trigger some action, such as
 * submitting a form, open a dialog, deleting items and more. The action
 * is triggered by click, space/enter keys or touching it.
 *
 */
const meta = {
  title: "Form/Button",
  tags: ["autodocs"],
  argTypes: {
    type: {
      name: "type",
      type: { name: "enum", value: ["submit", "reset", "button"] },
      description: `HTML Button [Type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type)`,
    },
    variant: {
      description: `Stylistic variation to emphasize the element`,
      type: {
        name: "enum",
        value: [...buttonVariants],
      },
    },
    size: {
      description: `Vertical size of the button`,
      type: {
        name: "enum",
        value: [...buttonSizes],
      },
    },
    disabled: {
      name: "disabled",
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Prevents user interaction",
    },
    name: {
      name: "name",
      control: "text",
      type: {
        name: "string",
      },
      description: "Name of the button, submitted as key/pair with the `value`",
    },
    value: {
      name: "value",
      control: "text",
      type: {
        name: "string",
      },
      description: "Value associated to the button's `name`",
    },
    block: {
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Displays as a block element",
    },
    icon: {
      name: "icon",
      control: { type: "select" },
      options: [clearItem, ...iconNames],
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed as part of the button",
    },
    click: {
      table: { category: "Events" },
      description:
        "fires when a pointing device button is both pressed and released",
      type: { name: "function" },
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the button, can be text or HTML",
    },
  },
  render: ({
    disabled,
    Default,
    value,
    name,
    icon,
    block,
    type,
    variant,
    size,
  }) => {
    return html`<apux-button
      variant=${variant}
      type=${type}
      ?disabled=${disabled}
      .value=${value}
      .name=${name}
      ?block=${block}
      icon=${ifDefined(icon)}
      .type=${type}
      size=${size}
      >${unsafeHTML(Default)}</apux-button
    >`;
  },
  parameters: {
    actions: {
      handles: ["click apux-button", "reset"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

const events = actions("onClick", "onSubmit");

/**
 * The primary button is intended for the main interaction of the user in a form.
 */
export const Primary: Story = {
  name: "Variant: Primary",
  args: {
    variant: "primary",
    Default: "Save",
  },
};

export const Ghost: Story = {
  name: "Variant: Ghost",
  args: {
    variant: "ghost",
    Default: "Unsubscribe",
  },
};

export const Discreet: Story = {
  name: "Variant: Discreet",
  args: {
    variant: "discreet",
    Default: "Prudent action",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    Default: "Delete database",
  },
};

export const Block: Story = {
  args: {
    variant: "primary",
    block: true,
    Default: "Submit form nicely",
  },
};

export const Default: Story = {
  args: {
    Default: "Cancel task",
  },
};

export const Small: Story = {
  args: {
    Default: "Compact cancel task",
    size: "small",
  },
};

export const ExtraSmall: Story = {
  args: {
    Default: "Compact cancel task",
    size: "extra-small",
  },
};

/**
 * Only an icon in the button.
 */
export const Iconic: Story = {
  args: {
    icon: "wrench",
  },
};

export const IconicExtraSmall: Story = {
  name: "Iconic: Extra small",
  args: {
    icon: "wrench",
    size: "extra-small",
  },
};

export const IconicSmall: Story = {
  name: "Iconic: Small",
  args: {
    icon: "wrench",
    size: "small",
  },
};

export const WithIcon: Story = {
  args: {
    Default: "Turn on bluetooth",
    icon: "bluetooth",
    variant: "ghost",
  },
};

/**
 * Click (including keyboard events) submits the form that contains the button.
 */
export const FormIntegration: Story = {
  render(args) {
    const submit = (event: SubmitEvent) => {
      event.preventDefault();
      const formData = new URLSearchParams(
        new FormData(event.target as HTMLFormElement) as unknown as string,
      ).toString();
      events.onSubmit({ event, formData });
    };
    return html`<form @submit=${submit}>
      ${meta.render(args)}
      <apux-button type="reset">Reset</apux-button>
      <apux-button name="submitter" value="cancel">Cancel</apux-button>
      <div>
        <apux-button type="button"
          >Just a button that doesn't submit</apux-button
        >
      </div>
    </form>`;
  },
  args: {
    name: "submitter",
    value: "confirm",
    Default: "Confirm",
    variant: "primary",
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    buttons.forEach((b) => userEvent.click(b));
  },
};

export const Events: Story = {
  args: {
    Default: "Notify",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole("button");
    userEvent.click(button);
  },
};

/**
 * **Warning!** about this story.
 *
 * Submitting the form will open new page (in the same frame)
 * with the path that doesn't exist.<br>
 * Which is the desired effect, since form doesn't prevent default action.
 */
export const FormSubmitting: Story = {
  name: "Submitting the form",
  args: {
    Default: "Action",
    name: "submitter",
    value: "confirm",
  },
  decorators: [(story) => html`<form target="_self">${story()}</form>`],
};

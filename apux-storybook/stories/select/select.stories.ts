import { actions } from "@storybook/addon-actions";
import { userEvent } from "@storybook/testing-library";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { componentSizes } from "../../../apux/src/types.js";
import { Item, continentOptions, longWordOptions } from "./common.js";

type Args = Partial<ApuxSelect> & {
  Default: string;
  items: Item[];
  change: never;
  showClearIcon: boolean;
};

/**
 * Allow the user to select one or multiple options from a defined
 * set of options.
 */
const meta = {
  title: "Form/Select/Select",
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      type: "boolean",
      description: "Allow the user to select multiple option",
    },
    required: {
      type: "boolean",
      description:
        "Whether the select must have a value before submitting the form",
    },
    block: {
      name: "block",
      type: "boolean",
      description: "Displays as a block element",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    showClearIcon: {
      name: "show-clear-icon",
      type: "boolean",
      description: "Shows a clear icon to remove the selected value",
    },
    size: {
      description: `Vertical size of the select`,
      type: {
        name: "enum",
        value: [...componentSizes],
      },
    },
    placeholder: {
      type: "string",
      description:
        "Displayed text in the control when there is no value introduced",
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
    items: {
      type: {
        name: "array",
        value: {
          name: "object",
          value: {
            value: { name: "string" },
            content: { name: "string" },
            selected: { name: "boolean" },
          },
        },
      },
      description: "Options to be selected, expressed as `<apux-option>`",
    },
    name: {
      type: "string",
      description:
        "Name of the select, submitted as key/pairs with the `value` of its options",
    },
    change: {
      table: { category: "Events" },
      description:
        "fires when the `value` of the control has been modified by the user",
      type: { name: "function" },
    },
    msgRequired: {
      type: "string",
      name: "msg-required",
      if: { arg: "required" },
      description:
        "A message to display when the value is required and yet not provided",
    },
  },
  render({
    name,
    multiple,
    placeholder,
    block,
    items,
    disabled,
    required,
    label,
    description,
    size,
    showClearIcon,
    msgRequired,
  }) {
    return html`<apux-select
      .name=${name}
      .placeholder=${placeholder}
      ?multiple=${multiple}
      .size=${size}
      ?block=${block}
      ?disabled=${disabled}
      ?show-clear-icon=${showClearIcon}
      ?required=${required}
      label=${ifDefined(label)}
      description=${ifDefined(description)}
      msg-required=${ifDefined(msgRequired)}
      >${items.map(
        ({ value, content, selected }: Item) =>
          html`<apux-option ?selected=${selected} value="${value}"
            >${content}</apux-option
          >`,
      )}</apux-select
    >`;
  },
  parameters: {
    actions: {
      handles: ["change", "clear"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

const submit = function (this: HTMLFormElement, event: SubmitEvent) {
  event.preventDefault();
  const data = new FormData(this);
  const params = new URLSearchParams(data as unknown as undefined).toString();
  events.onSubmit({ event, params });
};

export const Single: Story = {
  args: {
    placeholder: "Select a continent",
    items: continentOptions.map((c) => ({
      ...c,
      selected: c.value === "eu",
    })),
  },
};

export const Block: Story = {
  args: {
    placeholder: "Select a continent",
    items: continentOptions,
    block: true,
  },
};

export const ClearSelection: Story = {
  args: {
    placeholder: "Select a continent",
    items: continentOptions.map((c) => ({
      ...c,
      selected: c.value === "eu",
    })),
    showClearIcon: true,
  },
};

export const Small: Story = {
  args: {
    placeholder: "Compact select field",
    size: "small",
    items: continentOptions,
  },
};

export const Multiple: Story = {
  args: {
    placeholder: "Select some continents",
    multiple: true,
    items: continentOptions.map((c) => ({
      ...c,
      selected: c.value === "eu" || c.value === "na",
    })),
  },
};

export const OverOtherElements: Story = {
  render: (args) =>
    html`${meta.render(args)}
      <div style="background: lightblue; position: absolute; z-index: 999">
        Oceans have 999 z-index.
      </div>`,
  args: {
    placeholder: "Select a continent",
    items: continentOptions,
  },
};

export const Events: Story = {
  args: {
    placeholder: "Select a continent and look at the actions",
    items: continentOptions,
  },
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector("apux-select");
    userEvent.click(select!);
    const [, , opt3] = Array.from(
      canvasElement.querySelectorAll("apux-option"),
    );
    userEvent.click(opt3);
  },
};

const events = actions("onSubmit");

export const FormIntegration: Story = {
  render(args) {
    return html`<form @submit=${submit}>
      <strong>Select some options and press enter to submit</strong>
      <div>${meta.render(args)}</div>
    </form>`;
  },
  args: {
    placeholder: "Submit by enter",
    items: continentOptions,
    name: "continent",
  },
};

/**
 * The value is passed to the form only if the option is selected.
 */
export const Required: Story = {
  render(args) {
    return html`<form @submit=${submit}>
      <div>
        <apux-field
          style="max-width: fit-content;"
          label="Select some options and press enter to submit"
          >${meta.render(args)}</apux-field
        >
      </div>
    </form>`;
  },
  name: "Form integration (Required)",
  args: {
    placeholder: "Submit by enter",
    items: continentOptions,
    name: "continent",
    required: true,
  },
};

/**
 * Text in preview will display an **ellipsis** to represent clipped text,
 * whenever there isn't enough place to show the whole content.
 *
 * *Grab the dashed border from the right-bottom to change the size of the component*.
 */
export const Responsiveness: Story = {
  render(args) {
    return html`<div
      style="width:350px; min-width: 200px; resize:horizontal; border: dashed var(--apux-status-info) 3px; padding:10px; overflow: hidden;"
    >
      ${meta.render(args)}
    </div>`;
  },
  name: "Responsiveness - Single",
  args: {
    placeholder: "Examples of longest words",
    block: true,
    items: longWordOptions.map((c) => ({
      ...c,
      selected: c.value === "pn",
    })),
  },
};

export const ResponsivenessMultiple: Story = {
  render(args) {
    return html`<div
      style="width:350px; min-width: 200px; resize:horizontal; border: dashed var(--apux-status-info) 3px; padding:10px; overflow: hidden;"
    >
      ${meta.render(args)}
    </div>`;
  },
  name: "Responsiveness - Multiple",
  args: {
    placeholder: "Examples of longest words",
    block: true,
    multiple: true,
    items: longWordOptions.map((c) => ({
      ...c,
      selected: c.value === "te" || c.value === "in" || c.value === "pn",
    })),
  },
};

/**
 * Whenever it is **not enough space below**, then the dropdown will be shown above the select.
 *
 * In situation if there is **not enough space in any side**,
 * then dropdown will be shown on the position with more available space with the scroll.
 *
 * Open the story and move the controls panel up or down to see full functionality.
 */
export const DropdownPlacement: Story = {
  render(args) {
    return html`<div style="position:absolute; bottom:20px;">
        ${meta.render(args)}
      </div>
      <div style="position:absolute; top:20px;">${meta.render(args)}</div>`;
  },
  name: "Dropdown placement",
  args: {
    placeholder: "Examples of longest words",
    block: true,
    multiple: true,
    items: longWordOptions.map((c) => ({
      ...c,
      selected: c.value === "te" || c.value === "in" || c.value === "pn",
    })),
  },
};

export const ParentWithTransformProp: Story = {
  render(args) {
    return html`<div style="transform: translate(10px);">
        ${meta.render(args)}
      </div>
      <div style="transform: translate(10px)">${meta.render(args)}</div>
      <div style="transform: translate(10px)">${meta.render(args)}</div>`;
  },
  args: {
    placeholder: "Select continents",
    items: continentOptions.map((c) => ({
      ...c,
      selected: c.value === "eu",
    })),
  },
};

export const ParentWithWindowHeight: Story = {
  render(args) {
    return html`<div
      style="transform: translate(10px);height: calc(100vh - 36px)"
    >
      ${meta.render(args)}
    </div>`;
  },
  args: {
    placeholder: "Select continents",
    items: continentOptions.map((c) => ({
      ...c,
      selected: c.value === "eu",
    })),
  },
};

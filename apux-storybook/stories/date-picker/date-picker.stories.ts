import { actions } from "@storybook/addon-actions";
import { formatDate } from "@storybook/blocks";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { keyed } from "lit/directives/keyed.js";

type Args = ApuxDatePicker & { Default: string; change: never };

/** @internal */
function dateInCurrentMonth(day: number) {
  const date = new Date();
  date.setDate(day);
  return date.toISOString().split("T")[0];
}

/**
 * Date picker allows users to select a date by choosing its day, month and year.
 *
 * The language of this component can be selected by changing it in the top-bar.
 *
 * In code, it is possible to change the language by setting it to the global
 * object `ApuxSettings.language`.
 *
 * All languages included in the browser are available to be used in this control.
 *
 * Component can be fully controlled by keyboard:
 * - **Arrows** keys navigates to the right, left, down or up date tile.
 * - **Shift + Arrows** creates range selection (only if range property is enabled).
 * - By **tab** key it is possible to focus all of the buttons in the date picker.
 * - **Space** and **Enter** is working the same as clicking the elements.
 * - **Page Up & Page Down** keys move current date view to the next/previous month.
 */
const meta: Meta<Args> = {
  title: "Form/Date Picker",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      type: "string",
      description: "Value of the date picker",
    },
    range: {
      type: "boolean",
      description: "Allow user to select a range of dates",
    },
    valueEnd: {
      if: { arg: "range", eq: true },
      name: "value-end",
      control: "text",
      type: "string",
      description:
        "Value of the date picker, responsible for end of designated range",
    },
    name: {
      type: "string",
      description:
        "Name of the date picker, submitted as key/pair with the `value`",
    },
    nameEnd: {
      if: { arg: "range", eq: true },
      name: "name-end",
      type: "string",
      description:
        "Name of the date picker, allows to set a name for the form value associated to the end of the range",
    },
    now: {
      type: "string",
      control: "none",
      description:
        "Property (not an attribute) that is responsible for getting current date",
    },
    min: {
      type: "string",
      control: "date",
      description: "The minimal date that can be selected in the date picker",
    },
    max: {
      type: "string",
      control: "date",
      description: "The maximal date that can be selected in the date picker",
    },
    required: {
      type: "boolean",
      description:
        "Makes the value required, prevent the form to submit if not provided",
    },
    change: {
      table: { category: "Events" },
      description:
        "fires when the `value` of the control has been modified by the user",
      type: { name: "function" },
    },
  },
  render({ value, valueEnd, name, nameEnd, min, max, range, required }, ctx) {
    window.ApuxSettings.language = ctx.globals.language;
    const minDate = min ? formatDate(new Date(min)) : undefined;
    const maxDate = max ? formatDate(new Date(max)) : undefined;

    return html`${keyed(
      ctx.globals.language,
      html`<apux-date-picker
        .value=${value}
        .valueEnd=${valueEnd}
        .name=${name}
        .nameEnd=${nameEnd}
        min=${ifDefined(minDate)}
        max=${ifDefined(maxDate)}
        ?range=${range}
        ?required=${required}
      ></apux-date-picker>`
    )}`;
  },
  parameters: {
    actions: {
      handles: ["change"],
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

const events = actions("onSubmit");

const onSubmit = function (this: HTMLFormElement, event: SubmitEvent) {
  event.preventDefault();
  const data = new FormData(this);
  const params = new URLSearchParams(data as unknown as undefined).toString();
  events.onSubmit({ event, params });
};

export const Default: Story = {};

export const WithValue: Story = {
  name: "With value",
  args: {
    value: dateInCurrentMonth(22),
  },
};

/**
 * The value is passed to the form values, submit by button press.
 *
 * The form will be only submitted if the date is valid.
 *
 * Valid dates are:
 * - after the minimal one,
 * - before the maximal one,
 * - after the January 1st, AD 1.
 */
export const FormIntegration: Story = {
  render(args, ctx) {
    return html`<form @submit=${onSubmit}>
      <div>${meta.render!(args, ctx)}</div>
      <div>
        <apux-button variant="primary">Submit</apux-button>
      </div>
    </form>`;
  },
  args: {
    name: "selected-date",
    nameEnd: "end-date",
  },
};

/**
 * The value is passed to the form values only if the date is selected.
 */
export const Required: Story = {
  render(args, ctx) {
    return html`<form @submit=${onSubmit}>
      <div>
        <apux-field style="max-width: fit-content;" label="Select birth date"
          >${meta.render!(args, ctx)}</apux-field
        >
      </div>
      <div>
        <apux-button variant="primary">Submit</apux-button>
      </div>
    </form>`;
  },
  args: {
    name: "selected-date",
    nameEnd: "end-date",
    required: true,
  },
};

/**
 * Prevents the selection of a date that is before the minimal one.
 */
export const Min: Story = {
  name: "Min date",
  args: {
    value: dateInCurrentMonth(22),
    min: new Date(dateInCurrentMonth(13)),
  },
};

/**
 * Prevents the selection of a date that is after the maximal one.
 */
export const Max: Story = {
  name: "Max date",
  args: {
    value: dateInCurrentMonth(22),
    max: new Date(dateInCurrentMonth(26)),
  },
};

/**
 * Range selection will appears after selecting second date that is after the first one.
 */
export const Range: Story = {
  args: {
    range: true,
    value: dateInCurrentMonth(9),
    valueEnd: dateInCurrentMonth(19),
  },
};

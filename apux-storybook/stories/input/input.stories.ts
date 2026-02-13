/* eslint-disable jsdoc/require-description-complete-sentence */
import { actions } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";
import { Meta, StoryFn, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import {
  clockFormats,
  componentSizes,
  dateFormats,
  iconNames,
  timeFormats,
  timePeriods,
} from "../../../apux/src/types.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { formatDate } from "@storybook/blocks";
import { keyed } from "lit/directives/keyed.js";

type Args = Partial<ApuxInput> & {
  Default: string;
  input: never;
  change: never;
  iconClick: never;
  msgInvalidDay: never;
  msgAfterMaxDay: never;
  msgBeforeMinDay: never;
};

/**
 * Input is the cornerstone of user interfaces. It allows the user to enter
 * an input and edit information in the applications.
 */
const meta: Meta<Args> = {
  title: "Form/Input",
  tags: ["autodocs"],
  argTypes: {
    type: {
      type: {
        name: "enum",
        value: [
          "password",
          "text",
          "file",
          "number",
          "email",
          "search",
          "tel",
          "url",
          "date",
          "time",
          "datetime-local",
        ],
      },
      description: "The type of the content of the element",
    },
    icon: {
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed as part of the input",
    },
    size: {
      description: `Vertical size of the input`,
      type: {
        name: "enum",
        value: [...componentSizes],
      },
    },
    name: {
      type: "string",
      description: "Name of the input, submitted as key/pair with the `value`",
    },
    value: {
      type: "string",
      description: "Value associated to the input's `name`",
    },
    maxDate: {
      name: "max-date",
      if: { arg: "type", eq: "date" },
      type: "string",
      control: "date",
      description: "Maximal date that can be set through input",
    },
    minDate: {
      name: "min-date",
      if: { arg: "type", eq: "date" },
      type: "string",
      control: "date",
      description: "Minimal date that can be set through input",
    },
    dateFormat: {
      name: "date-format",
      type: {
        name: "enum",
        value: [...dateFormats],
      },
      description:
        "Format of the displayed date in the input. Used only in the `date` and `datetime-local` types of input.",
    },
    timeFormat: {
      name: "time-format",
      type: {
        name: "enum",
        value: [...timeFormats],
      },
      description:
        "Format of the displayed time in the input. Used only in the `time` and `datetime-local` types of input.",
    },
    showSeconds: {
      name: "show-seconds",
      control: "boolean",
      type: {
        name: "boolean",
      },
      description:
        "Displays an additional segment with seconds. Used only in the `time` and `datetime-local` types of input.",
    },
    showClockFormat: {
      type: "boolean",
      name: "show-clock-format",
      description:
        "Displays an additional segment with the clock format: 12h or 24h. The additional segment will be displayed only if `show-clock-format` is `true`. Used only in the `time` and `datetime-local` types of input.",
    },
    clockFormat: {
      type: {
        name: "enum",
        value: [...clockFormats],
      },
      name: "clock-format",
      description:
        "The clock format to use. It will be shown whenever `show-clock-format` is `true`. Used only in the `time` and `datetime-local` types of input.",
    },
    timePeriod: {
      type: {
        name: "enum",
        value: [...timePeriods],
      },
      if: { arg: "type", eq: "time" },
      name: "timePeriod",
      description:
        "The time period that describe part of the day: before midday - 'AM' and after midday - 'PM'. Used only in the `time` and `datetime-local` types of input.",
    },
    minTime: {
      name: "min-time",
      type: "string",
      if: { arg: "type", eq: "time" },
      description: "The minimal time that can be selected in the time picker",
    },
    maxTime: {
      name: "max-time",
      type: "string",
      if: { arg: "type", eq: "time" },
      description: "The maximal time that can be selected in the time picker",
    },
    maxDateTime: {
      name: "max-date-time",
      type: "string",
      if: { arg: "type", eq: "datetime-local" },
      description:
        "The maximal date and time that can be selected in the time picker",
    },
    minDateTime: {
      name: "min-date-time",
      type: "string",
      if: { arg: "type", eq: "datetime-local" },
      description:
        "The minimal date and time that can be selected in the time picker",
    },
    prefix: {
      type: "string",
      description:
        "A static text to be displayed before the value to clarify its context",
    },
    suffix: {
      type: "string",
      description:
        "A static text to be displayed after the value to clarify its context",
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
        "Makes the value required, prevent the form to submit if not provided",
    },
    msgRequired: {
      type: "string",
      name: "msg-required",
      if: { arg: "required" },
      description:
        "A message to display when the value is required and yet not provided",
    },
    pattern: {
      type: "string",
      description:
        "A [regex expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) the control's value should match",
    },
    msgPattern: {
      type: "string",
      if: { arg: "pattern" },
      name: "msg-pattern",
      description:
        "A message to display when the value doesn't match the pattern",
    },
    block: {
      name: "block",
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Displays as a block element",
    },
    hideNumericButtons: {
      name: "hide-numeric-buttons",
      type: "boolean",
      if: { arg: "type", eq: "number" },
      description: "Hides the increment and decrement buttons",
    },
    step: {
      type: "number",
      if: { arg: "type", eq: "number" },
      description: "Allows input to add/subtract to the quantity",
    },
    smallStep: {
      name: "small-step",
      type: "number",
      if: { arg: "type", eq: "number" },
      description:
        "Allows to increment/decrement by the value of small step using alt key",
    },
    bigStep: {
      name: "big-step",
      type: "number",
      if: { arg: "type", eq: "number" },
      description:
        "Allows to increment/decrement by the value of big step using shift key",
    },
    hugeStep: {
      name: "huge-step",
      type: "number",
      if: { arg: "type", eq: "number" },
      description:
        "Allows to increment/decrement by the value of huge step using ctrl key",
    },
    maxLength: {
      type: "number",
      name: "max-length",
      description: "Maximum number of characters allowed",
    },
    msgMaxLength: {
      type: "string",
      if: { arg: "maxLength" },
      name: "msg-max-length",
      description:
        "A message to display when the value exceeds the maximum length",
    },
    minLength: {
      type: "number",
      name: "min-length",
      description: "Minimum number of required characters",
    },
    msgMinLength: {
      type: "string",
      if: { arg: "minLength" },
      name: "msg-min-length",
      description:
        "A message to display when the value is shorter than min-length",
    },
    min: {
      type: "number",
      if: { arg: "type", eq: "number" },
      description: "Minimum value specified to keep value in range",
    },
    max: {
      type: "number",
      if: { arg: "type", eq: "number" },
      description: "Maximum value specified to keep value in range",
    },
    msgMin: {
      type: "string",
      name: "msg-min",
      if: { arg: "min" },
      description:
        "A message to display when the value is lesser than the minimum allowed value  \n" +
        "The message contains a placeholder `{{min}}` that is replaced by the nearest valid value.",
    },
    msgMax: {
      type: "string",
      name: "msg-max",
      if: { arg: "max" },
      description:
        "A message to display when the value is greater than the maximum allowed value  \n" +
        "The message contains a placeholder `{{max}}` that is replaced by the nearest valid value.",
    },
    msgStep: {
      type: "string",
      name: "msg-step",
      if: { arg: "type", eq: "number" },
      description:
        "A message to display, when the form submits a value that is close to the only one valid value.  \n" +
        "The message contains a placeholder `{{value}}` that is replaced by the nearest valid value",
    },
    msgStepDouble: {
      type: "string",
      name: "msg-step-double",
      if: { arg: "type", eq: "number" },
      description:
        "A message to display, when the form submits a value that is between two valid values.  \n" +
        "The message contains two placeholders `{{previous}}` and `{{next}}` that are replaced by the two nearest valid values",
    },
    msgInvalidDay: {
      type: "string",
      name: "msg-invalid-date",
      if: { arg: "type", eq: "date" },
      description:
        "It's the message displayed, when the form submits a value with the invalid date",
    },
    msgAfterMaxDay: {
      type: "string",
      name: "msg-after-max-date",
      if: { arg: "type", eq: "date" },
      description:
        "It's the message displayed, when the form submits a value with a date that is after the maximal date",
    },
    msgBeforeMinDay: {
      type: "string",
      name: "msg-before-min-date",
      if: { arg: "type", eq: "date" },
      description:
        "It's the message displayed, when the form submits a value with a date that is before minimal date",
    },
    msgInvalidTime: {
      type: "string",
      name: "msg-invalid-time",
      if: { arg: "type", eq: "time" },
      description:
        "It's the message displayed, when the form submits a value with the invalid time",
    },
    msgMinTime: {
      type: "string",
      name: "msg-min-time",
      if: { arg: "type", eq: "time" },
      description:
        "A message to display when the selected time is before minimal one",
    },
    msgMaxTime: {
      type: "string",
      name: "msg-max-time",
      if: { arg: "type", eq: "time" },
      description:
        "A message to display when the selected time is after maximal one",
    },
    autocomplete: {
      type: {
        name: "enum",
        value: [
          "on",
          "off",
          "name",
          "email",
          "username",
          "new-password",
          "current-password",
        ],
      },
      description:
        "The autocomplete attribute specifies which autocomplete feature is used for the input.",
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
    iconClick: {
      table: { category: "Events" },
      name: "icon-click",
      description: "fires when the icon is clicked and bubbles the event",
      type: { name: "function" },
    },
  },
  render(
    {
      type,
      name,
      value,
      prefix,
      suffix,
      placeholder,
      autocomplete,
      label,
      icon,
      description,
      disabled,
      required,
      block,
      size,
      msgRequired,
      pattern,
      msgPattern,
      step,
      smallStep,
      bigStep,
      hugeStep,
      minLength,
      msgMinLength,
      maxLength,
      msgMaxLength,
      hideNumericButtons,
      min,
      max,
      msgMax,
      msgMin,
      msgStep,
      msgStepDouble,
      dateFormat,
      maxDate,
      minDate,
      msgInvalidDay,
      msgAfterMaxDay,
      msgBeforeMinDay,
      timeFormat,
      showSeconds,
      showClockFormat,
      clockFormat,
      timePeriod,
      maxTime,
      minTime,
      msgInvalidTime,
      msgMinTime,
      msgMaxTime,
      minDateTime,
      maxDateTime,
    },
    ctx,
  ) {
    window.ApuxSettings.language = ctx.globals.language;
    const minimalDate = minDate ? formatDate(new Date(minDate)) : undefined;
    const maximalDate = maxDate ? formatDate(new Date(maxDate)) : undefined;

    return html`${keyed(
      ctx.globals.language,
      html`<apux-input
        .type=${type}
        .name=${name}
        .value=${value}
        .size=${size}
        prefix=${ifDefined(prefix)}
        suffix=${ifDefined(suffix)}
        placeholder=${ifDefined(placeholder)}
        step=${ifDefined(step)}
        small-step=${ifDefined(smallStep)}
        big-step=${ifDefined(bigStep)}
        huge-step=${ifDefined(hugeStep)}
        .label=${label}
        icon=${ifDefined(icon)}
        .description=${description}
        .block=${block}
        msg-required=${ifDefined(msgRequired)}
        ?disabled=${disabled}
        ?required=${required}
        date-format=${ifDefined(dateFormat)}
        min-date=${ifDefined(minimalDate)}
        max-date=${ifDefined(maximalDate)}
        pattern=${ifDefined(pattern)}
        msg-pattern=${ifDefined(msgPattern)}
        min-length=${ifDefined(minLength)}
        msg-min-length=${ifDefined(msgMinLength)}
        max-length=${ifDefined(maxLength)}
        msg-max-length=${ifDefined(msgMaxLength)}
        ?hide-numeric-buttons=${hideNumericButtons}
        min=${ifDefined(min)}
        max=${ifDefined(max)}
        msg-min=${ifDefined(msgMin)}
        msg-max=${ifDefined(msgMax)}
        msg-step=${ifDefined(msgStep)}
        msg-step-double=${ifDefined(msgStepDouble)}
        msg-invalid-date=${ifDefined(msgInvalidDay)}
        msg-after-max-date=${ifDefined(msgAfterMaxDay)}
        msg-before-min-date=${ifDefined(msgBeforeMinDay)}
        time-format=${timeFormat}
        ?show-seconds=${showSeconds}
        clock-format=${clockFormat}
        .timePeriod=${timePeriod}
        ?show-clock-format=${showClockFormat}
        min-time=${ifDefined(minTime)}
        max-time=${ifDefined(maxTime)}
        msg-invalid-time=${ifDefined(msgInvalidTime)}
        msg-min-time=${ifDefined(msgMinTime)}
        msg-max-time=${ifDefined(msgMaxTime)}
        min-date-time=${ifDefined(minDateTime)}
        max-date-time=${ifDefined(maxDateTime)}
        .autocomplete=${autocomplete}
      ></apux-input>`,
    )}`;
  },
  parameters: {
    actions: {
      handles: ["change", "input", "icon-click"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Textual: Story = {
  args: { placeholder: "Your name", value: "John Doe" },
};

export const Placeholder: Story = {
  args: { placeholder: "Your name" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Difficult password" },
};

export const LabelAndDescription: Story = {
  render(args, ctx) {
    const { label, description, ...rest } = args;
    return html`<apux-field
      style="max-width: fit-content;"
      label=${ifDefined(label)}
      description=${ifDefined(description)}
    >
      ${meta.render!(rest, ctx)}
    </apux-field>`;
  },
  args: {
    placeholder: "Write here",
    label: "Your name",
    description: "Literally, just write your name in this field and that's it",
  },
};

/**
 * Autocomplete is a feature that allows the browser to suggest values
 * based on the previously entered values.
 *
 * It can be used to speed up
 * the input process and reduce the number of errors.
 *
 * This example shows only some of the possible values for the `autocomplete` attribute.
 *
 * Possible values are defined in the [HTML Autocomplete Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) documentation.
 */
export const Autocomplete: Story = {
  args: {
    type: "text",
    placeholder: "Enter your email",
    autocomplete: "email",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "You cannot write here",
    label: "Try it!",
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: "Something must be written here",
    label: "This must be filled!",
    required: true,
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Enter current temperature",
    icon: "temperature",
  },
};

export const Prefix: Story = {
  args: {
    value: "abb.com",
    prefix: "www.",
  },
};

export const Suffix: Story = {
  args: {
    value: "16",
    suffix: "px",
  },
};

export const Block: Story = {
  args: {
    placeholder: "Blocky blocks!",
    label: "Big blocks",
    block: true,
  },
};

export const Small: Story = {
  args: {
    placeholder: "Compact input field",
    size: "small",
    icon: "power-on-off",
  },
};

const events = actions("onSubmit");

const submit = function (this: HTMLFormElement, event: SubmitEvent) {
  event.preventDefault();
  const data = new FormData(this);
  const params = new URLSearchParams(data as unknown as undefined).toString();
  events.onSubmit({ event, params });
};

const templateForm: StoryFn<Args> = (args, ctx) => {
  const { label, description, ...rest } = args;
  return html`<form @submit=${submit}>
    <div>
      <apux-field
        style="max-width: fit-content;"
        label=${ifDefined(label)}
        description=${ifDefined(description)}
        >${meta.render!(rest, ctx)}</apux-field
      >
    </div>
    <div>
      <apux-field label="Address" style="max-width: fit-content;">
        <apux-input name="address" required value="Street 123"></apux-input>
      </apux-field>
    </div>
    <div><apux-button variant="primary">Submit</apux-button></div>
    <p>
      <em>The form can be submitted by pressing Enter on the input field.</em>
    </p>
  </form>`;
};

/**
 * The value is passed to the form values only if the value is introduced,
 * submit by pressing **Enter**.
 */
export const FormIntegration: Story = {
  render: templateForm,
  name: "Form integration (Required)",
  args: {
    placeholder: "Enter your name",
    required: true,
    name: "user-name",
    icon: "user-in-circle",
    label: "Name",
    description: "Enter some value",
    msgRequired: "Field required",
  },
};

/**
 * The form will be only submitted if the value is matched by the pattern.
 */
export const FormIntegrationPattern: Story = {
  render: templateForm,
  name: "Form integration (Pattern)",
  args: {
    required: false,
    name: "battery",
    icon: "battery-high",
    label: "Battery level",
    description: "Enter low, medium or high or percentage (e.g. 55%)",
    pattern: "\\d{2}%|low|medium|high",
    msgPattern: "The battery level is not one of the values described",
    msgRequired: "Field required",
  },
};

export const Events: Story = {
  render(args, ctx) {
    return html`${meta.render!(args, ctx)}${meta.render!(args, ctx)}`;
  },
  args: { icon: "star" },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const [input, extra] = canvas.getAllByRole("input");
    userEvent
      .type(
        input.shadowRoot!.querySelector("input")!,
        "hello wro{backspace}{backspace}ord",
        {
          delay: 50,
        },
      )
      .then(() => {
        userEvent.click(extra.shadowRoot!.querySelector("input")!);
      });
  },
};

/**
 * A numeric input is an input field that only accepts numbers.
 * It is possible to write a value directly or use the buttons
 * to increment/decrement the value.
 */
export const Numeric: Story = {
  render: LabelAndDescription.render,
  args: {
    placeholder: "Number",
    size: "small",
    type: "number",
    description: "Enter the number or use the buttons",
  },
};

/**
 * The numeric input can be configured to hide the increment/decrement buttons.
 */
export const Buttons: Story = {
  render: LabelAndDescription.render,
  name: "Numeric - Hidden buttons",
  args: {
    placeholder: "Number",
    hideNumericButtons: true,
    size: "small",
    type: "number",
    description: "Enter the number",
  },
};

/**
 * The value can be **incremented/decremented** in several ways described below:
 *
 * **Default step:**
 *
 * Default value is 1.
 * - Click on the **+** or **-** buttons.
 * - Press **Up** or **Down** arrow keys.
 *
 * **Small step:**
 *
 * It is necessary to set the value for small step, because it's **undefined by default.**
 * - Click on the **+** or **-** buttons while pressing **Alt**.
 * - Press **Alt + Up/Down** arrow keys.
 *
 * **Big step:**
 *
 * Default value is 10.
 * - Click on the **+** or **-** buttons while pressing **Shift**.
 * - Press **Shift + Up/Down** arrow keys.
 *
 * **Huge step:**
 *
 * Default value is 100.
 * - Click on the **+** or **-** buttons while pressing **Ctrl**.
 * - Press **Ctrl + Up/Down** arrow keys.
 */
export const NumericKeyboardInteraction: Story = {
  render: LabelAndDescription.render,
  name: "Numeric - Keyboard interaction",
  args: {
    placeholder: "Number",
    size: "small",
    type: "number",
    smallStep: 0.5,
  },
};

/**
 * The form will be only submitted if the number is valid.
 *
 * Valid values are :
 * - **multiples of steps**,
 * - values lesser than the **maximum (max)** and greater than the **minimum (min)**.
 */
export const FormIntegrationNumeric: Story = {
  render: templateForm,
  name: "Numeric - Form integration",
  args: {
    type: "number",
    name: "numeric",
    placeholder: "Enter a Number",
    label: "Submit by keyboard",
    icon: "calculator",
    min: -10,
    max: 10,
  },
};

const takenUsers = ["john", "jane", "joe", "jim", "jill"];

/**
 * The input field can receive a custom validation error. In case, the form
 * attempts to be submitted, the error will be shown as in the case of the
 * default validation rules.
 *
 * The custom validation is set using the `setCustomValidity` method.
 */
export const FormIntegrationCustomValidation: Story = {
  render(args, ctx) {
    const { label, description, ...rest } = args;

    return html`<form @submit=${submit}>
      <apux-field
        label=${ifDefined(label)}
        description=${ifDefined(description)}
        @input=${(ev: Event) => {
          const target = ev.target as ApuxInput;
          target.setCustomValidity(
            takenUsers.includes(target.value)
              ? `The name "${target.value}" is already taken`
              : "",
          );
        }}
        >${meta.render!(rest, ctx)}
      </apux-field>
      <apux-button variant="primary">Submit</apux-button>
      <h4>Taken users names</h4>
      <p>Try to use one of these names:</p>
      <ul>
        ${takenUsers.map((name) => html`<li>${name}</li>`)}
      </ul>
    </form>`;
  },
  name: "Form integration (Custom validation)",
  args: {
    placeholder: "User name",
    name: "user-name",
    description: "The user name is used to identify you",
  },
};

export const FormIntegrationMinLength: Story = {
  render: templateForm,
  name: "Form integration (Min length)",
  args: {
    placeholder: "Enter the recovery key",
    name: "key",
    description: "The recovery key is 5 characters long",
    minLength: 5,
  },
};

export const FormIntegrationMaxLength: Story = {
  render: templateForm,
  name: "Form integration (Max length)",
  args: {
    placeholder: "Zip Code",
    name: "key",
    description: "The zip code is maximum 6 characters long",
    maxLength: 6,
  },
};

export const Responsiveness: Story = {
  decorators: [
    (story) =>
      html`<div
        style="width: 400px; resize:horizontal; border: dashed var(--apux-state-info) 3px; padding:10px; overflow: hidden;"
      >
        ${story()}
      </div>`,
  ],
  args: {
    value: "11100100110010",
    prefix: "0",
    suffix: "1",
    type: "number",
    block: true,
    icon: "io-devices",
  },
};

/**
 * A date type of the input allows to select a date.
 * It is possible to write a date directly or use the date picker that appears after click on the input.
 *
 * To select date from the date picker, click on one of the tiles and click select button.
 */
export const DateType: Story = {
  render: LabelAndDescription.render,
  name: "Date",
  args: {
    dateFormat: "default",
    size: "small",
    type: "date",
    value: "15/06/2023",
  },
};

/**
 * It is possible to provide date in value in three different formats:
 *
 * - **default: "DD/MM/YYYY"**, for example "27/06/2023",
 *
 * - **us: "MM/DD/YYYY"**, for example "06/27/2023",
 *
 * - **iso: "YYYY-MM-DD"**, for example "2023-06-27".
 *
 */
export const DateFormats: Story = {
  render(args, ctx) {
    return html`<div>
      ${meta.render!(args, ctx)}
      <apux-input type="date" date-format="us" size="small"></apux-input>
      <apux-input type="date" date-format="iso" size="small"></apux-input>
      <p>
        <strong>"DD/MM/YYYY"</strong> is used if not specified, except for
        locale "en-US", which uses <strong>"us"</strong>:
      </p>
      <apux-input type="date" size="small"></apux-input>
    </div>`;
  },
  name: "Date Formats",
  args: {
    dateFormat: "default",
    size: "small",
    type: "date",
  },
};

/**
 * Whenever it is **not enough space below**, then the dropdown will be shown above the input.
 *
 * Dropdown will be closed anytime any action is performed outside of the input.
 * For example by clicking outside, scrolling, or resizing the window.
 *
 * Open the story and move the controls panel up or down to see full functionality.
 */
export const DateTypePosition: Story = {
  render(args, ctx) {
    return html`<div style="position:absolute; bottom:20px;">
        ${meta.render!(args, ctx)}
      </div>
      <div style="position:absolute; top:25px;">
        ${meta.render!(args, ctx)}
      </div>`;
  },
  name: "Date - Dropdown placement",
  args: {
    dateFormat: "default",
    size: "small",
    type: "date",
  },
};

export const DateTypeForm: Story = {
  render: templateForm,
  name: "Date - Form integration",
  args: {
    dateFormat: "default",
    size: "small",
    type: "date",
    name: "date",
  },
};

/**
 * A **time type** of the input allows to select a time.
 * It is possible to write a time directly or use the time picker that appears after click on the input.
 *
 * To select time from the time picker, click on one of the segments and click select button.
 *
 * Input with **time type** supports many formats of time provided in it's value.
 *
 * Allowed format examples:
 * - `HH:MM:SS`,
 * - `HH:MM`,
 * - above examples with `pm` or `am` suffix (E.g. *05:11 pm*).
 */
export const TimeType: Story = {
  render: LabelAndDescription.render,
  name: "Time",
  args: {
    timeFormat: "default",
    size: "small",
    type: "time",
  },
};

/**
 * In that story, presented input contain `clock-format` set as `12h` and `show-seconds` set as true.
 *
 * With those configurations time picker shows its full potential.
 */
export const TimeFormat: Story = {
  render: LabelAndDescription.render,
  name: "Time - Different Format",
  args: {
    size: "small",
    showSeconds: true,
    clockFormat: "12h",
    type: "time",
    timeFormat: "with-seconds",
    showClockFormat: true,
  },
};

export const TimeTypeForm: Story = {
  render: templateForm,
  name: "Time - Form integration",
  args: {
    dateFormat: "default",
    size: "small",
    type: "time",
    name: "time",
    timeFormat: "with-seconds",
    showClockFormat: true,
    showSeconds: true,
  },
};

/**
 * A datetime-local type of the input allows to select a date with a time.
 * It is possible to write a date & time directly or use date & time pickers that appears after click on the input.
 *
 * It is possible to use different date and time formats. For more info check [time](/story/form-input--time-type). or [date](/story/form-input--date-type) input documentation.
 */
export const DateTimeType: Story = {
  render: LabelAndDescription.render,
  name: "Date-time",
  args: {
    size: "small",
    type: "datetime-local",
  },
};

export const DateTimeFull: Story = {
  render: LabelAndDescription.render,
  name: "Date-time - Different Format",
  args: {
    dateFormat: "iso",
    timeFormat: "with-seconds",
    size: "small",
    type: "datetime-local",
    showSeconds: true,
    showClockFormat: true,
    clockFormat: "12h",
  },
};

export const DateTimeForm: Story = {
  render: templateForm,
  name: "Date-time - Form integration",
  args: {
    dateFormat: "default",
    timeFormat: "with-seconds",
    size: "small",
    type: "datetime-local",
    name: "date&time",
  },
};

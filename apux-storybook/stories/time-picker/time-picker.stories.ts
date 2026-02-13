import { actions } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { clockFormats, timePeriods } from "@abb-hmi/apux/types";

type Args = ApuxTimePicker & {
  Default: string;
  timePeriodChange: never;
  clockFormatChange: never;
};

/**
 * Time picker allows users to select a time by choosing its hour, minutes and seconds.
 *
 * It is possible to select time in two formats: 12h and 24h.
 * When the 12h format is selected, the time period is also displayed.
 *
 * Value will be always returned in 24h format.
 *
 * Component can be fully controlled by keyboard:
 * - By **tab** key it is possible to focus all of the segment controls in the time picker.
 * - **AM/PM** and **12h/24h** segment controls:
 *  - **Left/Right Arrows** keys navigates to the right, left, segment.
 *  - **Space** is selecting chosen segment in AM/PM and 12h/24h segment controls.
 * - **Hour/Minutes/Seconds** segment controls:
 *  - **Up/Down Arrows** keys navigates and select segment above/below.
 */
const meta = {
  title: "Form/Time picker",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      type: "string",
      description: "Value of the time picker",
    },
    showSeconds: {
      name: "show-seconds",
      control: "boolean",
      type: {
        name: "boolean",
      },
      description: "Displays an additional segment with seconds.",
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
    name: {
      type: "string",
      description:
        "Name of the time picker, submitted as key/pair with the `value`",
    },
    min: {
      type: "string",
      description: "The minimal time that can be selected in the time picker",
    },
    max: {
      type: "string",
      description: "The maximal time that can be selected in the time picker",
    },
    showClockFormat: {
      type: "boolean",
      name: "show-clock-format",
      description:
        "Displays an additional segment with the clock format: 12h or 24h. The additional segment will be displayed only if `show-clock-format` is `true`.",
    },
    clockFormat: {
      type: {
        name: "enum",
        value: [...clockFormats],
      },
      name: "clock-format",
      description:
        "The clock format to use. It will be shown whenever `show-clock-format` is `true` witch means 12h.",
    },
    timePeriod: {
      type: {
        name: "enum",
        value: [...timePeriods],
      },
      name: "time-period",
      description:
        "The time period that describe part of the day: before midday - 'AM' and after midday - 'PM'.",
    },
    timePeriodChange: {
      table: { category: "Events" },
      name: "time-period-change",
      description: "fires when the time period is changed.",
      type: "function",
    },
    clockFormatChange: {
      table: { category: "Events" },
      name: "clock-format-change",
      description: "fires when the clock format is changed.",
      type: "function",
    },
  },
  render: ({
    showSeconds,
    value,
    required,
    msgRequired,
    name,
    showClockFormat,
    clockFormat,
    timePeriod,
    min,
    max,
  }) => {
    return html`<apux-time-picker
      ?show-seconds=${showSeconds}
      .value=${value}
      .name=${name}
      .min=${ifDefined(min)}
      .max=${ifDefined(max)}
      clock-format=${clockFormat}
      .time-period=${timePeriod}
      ?show-clock-format=${showClockFormat}
      ?required=${required}
      msg-required=${ifDefined(msgRequired)}
    ></apux-time-picker>`;
  },
} satisfies Meta<Args>;

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
  args: { showSeconds: true, value: "12:30:25" },
};

export const WithSeconds: Story = {
  args: { showSeconds: true },
};

/**
 * The value is passed to the form values, submit by button press.
 *
 *  The form will be only submitted if the time is valid.
 *
 * Valid time examples are:
 * - after the minimal one,
 * - before the maximal one.
 */
export const FormIntegration: Story = {
  render(args) {
    return html`<form
      @submit=${onSubmit}
      style="display:flex; flex-direction: column;
    gap: 20px;"
    >
      <div>${meta.render(args)}</div>
      <div>
        <apux-button variant="primary">Submit</apux-button>
      </div>
    </form>`;
  },
  args: {
    name: "selected-time",
  },
};

/**
 * The value is passed to the form value only if the time is selected.
 */
export const Required: Story = {
  render(args) {
    return html`<form @submit=${onSubmit}>
      <div>
        <apux-field style="max-width: fit-content;" label="Select lunch time"
          >${meta.render(args)}</apux-field
        >
      </div>
      <div>
        <apux-button variant="primary">Submit</apux-button>
      </div>
    </form>`;
  },
  args: {
    name: "selected-time",
    required: true,
  },
};

/**
 * Minimal time will disable all the segments that describe the time before it.
 */
export const Min: Story = {
  name: "Min time",
  args: {
    value: "21:37:30",
    min: "21:37:45",
    showSeconds: true,
  },
};

/**
 * Maximal time will disable all the segments that describe the time after it.
 */
export const Max: Story = {
  name: "Max time",
  args: {
    value: "16:45:30",
    max: "16:45:25",
    showSeconds: true,
  },
};

export const DifferentFormat: Story = {
  args: { showSeconds: true, clockFormat: "12h", showClockFormat: true },
};

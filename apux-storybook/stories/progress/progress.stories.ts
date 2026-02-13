import { progressVariants, progressLabelStyles } from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { ApuxProgress } from "@abb-hmi/apux";

type Args = ApuxProgress;

/**
 * The progress bar provides feedback of actions that may take time to complete,
 * to inform the user that is being processed. This activities can be for example,
 * uploading/downloading files, processing information among others.
 *
 * The progress bar will be filled partially meanwhile the task is being processed.
 * It will be fully filled when the task is completed.
 *
 * Avoid using the progress bar as a gauge to indicate levels of usage or status
 * of any system. Keep it exclusively for displaying the progress of an
 * activity.
 *
 * It is **important** to always run heavy tasks asynchronously in a different
 * execution thread (http request or a web worker), never run heavy tasks in
 * the same thread as the UI, this may result in an uncomfortable visual lag.
 */
const meta: Meta<Args> = {
  title: "General/Progress",
  tags: ["autodocs"],
  argTypes: {
    max: {
      type: "number",
      description:
        "The maximum value that the progress bar represents, it must be bigger than 0, and it represents the total work to be done",
    },
    value: {
      type: "number",
      description:
        "The current processed value, it must be a value between 0 anx `max` (or `1` if `max` is not set)",
    },
    labelStyle: {
      type: { name: "enum", value: [...progressLabelStyles] },
      name: "label-style",
      description:
        "Displays a label that indicated textually the progress of the activity",
    },
    invalid: {
      type: "boolean",
      description:
        "Forces the component to behave like an invalid form element",
    },
    succeeded: {
      type: "boolean",
      description:
        "Marks the component as successful after performing an operation",
    },
    variant: {
      description: `Stylistic variation to emphasize the element`,
      type: {
        name: "enum",
        value: [...progressVariants],
      },
    },
  },
  render({ variant, max, value, labelStyle, invalid, succeeded }) {
    return html`<apux-progress
      variant=${ifDefined(variant)}
      max=${ifDefined(max)}
      value=${ifDefined(value)}
      label-style=${ifDefined(labelStyle)}
      ?succeeded=${succeeded}
      ?invalid=${invalid}
    ></apux-progress>`;
  },
};

export default meta;

type Story = StoryObj<Args>;

/**
 * An example of a task with 40% loaded work.
 */
export const Default: Story = {
  args: { value: 0.4 },
};

/**
 * Discreet loading indicator is used primarily when mass loading items
 * or when the loading event is non-intrusive type.
 */
export const VariantDiscreet: Story = {
  name: "Variant: Discreet",
  args: { value: 0.2, variant: "discreet" },
};

/**
 * Accent loading indicator can be used when a loading event
 * is interrupting or causing other intrusive latency for the user.
 */
export const VariantAccent: Story = {
  name: "Variant: Accent",
  args: { value: 0.95, variant: "accent" },
};

/**
 * The indeterminate state is currently equivalent to `value: 0`, however, it
 * is recommended to **set the value**, because this behavior may change in the future.
 */
export const Indeterminate: Story = {
  args: {},
};

/**
 * Displays textually the progress as a fraction `value / max`.
 *
 * This option will set the `label-suffix` of its parent field automatically.
 * It only works when the progress is a child of a field.
 */
export const Fraction: Story = {
  name: "Textual: Fraction",
  render(args, ctx) {
    return html`<apux-field
      label="Sending files"
      description="The files are being uploaded and dispatched to your peers"
      >${meta.render!(args, ctx)}
    </apux-field>`;
  },
  args: { labelStyle: "fraction", value: 3, max: 5 },
};

/**
 * Displays textually the progress as a percentage of work done.
 *
 * This option will set the `label-suffix` of its parent field automatically.
 * It only works when the progress is a child of a field.
 */
export const Percentage: Story = {
  name: "Textual: Percentage",
  render(args, ctx) {
    return html`<apux-field
      label="Uploading profile photo"
      description="Your new profile photo is being uploaded and processes"
      >${meta.render!(args, ctx)}
    </apux-field>`;
  },
  args: { labelStyle: "percentage", value: 1, max: 3 },
};

/**
 * Marking a progress bar as invalid, will display it in errored style.
 *
 * If it is inside a field, the field will also behave as invalid.
 */
export const Invalid: Story = {
  render(args, ctx) {
    return html`<apux-field
      label="Uploading cat pictures"
      description="Cat pictures are not allowed as profile photos"
      >${meta.render!(args, ctx)}
    </apux-field>`;
  },
  args: { value: 4, max: 5, invalid: true },
};

/**
 * Marking a progress bar as succeeded, will display it in success style.
 *
 * If it is inside a field, the field will also behave as successful.
 */
export const Succeeded: Story = {
  render(args, ctx) {
    return html`<apux-field
      label="Uploading cat pictures"
      description="The cat picture was successful set as your profile photo"
      >${meta.render!(args, ctx)}
    </apux-field>`;
  },
  args: { labelStyle: "percentage", value: 1, succeeded: true },
};

import {
  spinnerLoaderSizes,
  spinnerLoaderStates,
  spinnerLoaderVariants,
} from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { responsive } from "../../utils/decorators.js";

type Args = ApuxSpinnerLoader & { customSize: boolean };

/**
 * The loading indicator provides immediate feedback to the user of actions
 * that have been started to reduce frustration of users when waiting for
 * long operations.
 * Examples of actions include loading an application,
 * downloading updates or applying new configurations.
 *
 * The loader spinner is an animated spinning indicator that lets users
 * know content is being processed.
 *
 * A Spinner is shown when it's unsure how long a task will take.
 *
 * It is **important** to always run heavy tasks asynchronously in a different
 * execution thread (http request or a web worker), never run heavy tasks in
 * the same thread as the UI, this may result in an uncomfortable visual lag.
 */
const meta: Meta<Args> = {
  title: "General/Spinner Loader",
  tags: ["autodocs"],
  argTypes: {
    size: {
      type: { name: "enum", value: [...spinnerLoaderSizes] },
      description: "Predefined and recommended sizes of the loader",
    },
    variant: {
      type: { name: "enum", value: [...spinnerLoaderVariants] },
      description: "Stylistic variation to emphasize the element",
    },
    state: {
      type: { name: "enum", value: [...spinnerLoaderStates] },
      description: "Current state of the process in progress",
    },
  },
  render({ size, variant, state, customSize }) {
    return html`<apux-spinner-loader
      size=${size}
      variant=${variant}
      state=${state}
      style=${ifDefined(customSize ? "width: 100%; height: 100%" : undefined)}
    ></apux-spinner-loader>`;
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {},
};

/**
 * Exclusively designed for critical operations that require the attention
 * of the user.
 */
export const VariantAccent: Story = {
  name: "Variant: Accent",
  args: { variant: "accent" },
};

/**
 * This variant indicates a non-critical action being processed.
 * It tries not to catch the attention of the user.
 * It can also be used for batch operations.
 */
export const VariantDiscreet: Story = {
  name: "Variant: Discreet",
  args: { variant: "discreet" },
};

/**
 * Indicates that a process was finalized successfully without any error.
 */
export const Success: Story = {
  args: { state: "success" },
};

/**
 * Indicates that a process was finalized with errors.
 */
export const ErrorStatus: Story = {
  name: "Error",
  args: { state: "error" },
};

/**
 * The loader comes with 3 recommended sizes, but it can be used with any size
 * that the application requires. The ratio is always `1:1`.
 *
 * And in very small sizes, the icon of success/error statuses is not visible.
 */
export const CustomSizes: Story = {
  args: { customSize: true },
  render(params, ctx) {
    return html`<apux-spinner-loader></apux-spinner-loader>
      <apux-spinner-loader style="width:16px"></apux-spinner-loader>
      <apux-spinner-loader
        state="success"
        style="width:16px"
      ></apux-spinner-loader>
      <apux-spinner-loader
        state="success"
        style="width:18px"
      ></apux-spinner-loader>
      <apux-spinner-loader
        state="error"
        style="width:16px"
      ></apux-spinner-loader>
      <apux-spinner-loader
        state="error"
        style="width:18px"
      ></apux-spinner-loader>
      ${responsive({
        resize: "both",
        padding: false,
        height: "default",
      })(() => meta.render!(params, ctx), ctx)}`;
  },
};

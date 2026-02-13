import { componentSizes, toggleVariants } from "@abb-hmi/apux/types";
import { actions } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { responsive } from "../../utils/decorators.js";

type Args = ApuxSegmentControl & { Default: string };

/**
 * A segmented control presents a set of distinct options or segments to the user,
 * allowing them to choose one option at a time,
 * Each segment is typically displayed as a separate button,
 * and only one segment can be active or selected at any given moment.
 *
 * **Keyboard interaction:**
 * - Pressing Left/Right moves to the next segment(when orientation is horizontal).
 * - Pressing Up/Down moves to the next segment(when orientation is vertical).
 * - Pressing tab focuses on next field.
 * - Enter / Select selects the focused non-disabled field.
 */

const meta = {
  title: "Form/Segment Control/Segment Control",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      type: { name: "enum", value: ["horizontal", "vertical"] },
      description: "Defines the direction of the segment control buttons",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Any content/label for the segment control, can be text or HTML",
    },
    variant: {
      type: { name: "enum", value: [...toggleVariants] },
      description: "Stylistic variation to emphasize the element",
    },
    size: {
      description: `Vertical size of the toggle button`,
      type: {
        name: "enum",
        value: [...componentSizes],
      },
    },
  },
  render({ Default, orientation, size, variant }) {
    return html`<apux-segment-control
      .variant=${variant}
      .size=${size}
      orientation=${ifDefined(orientation)}
      >${unsafeHTML(Default)}</apux-segment-control
    >`;
  },
  parameters: {
    actions: {
      handles: ["change", "click"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    Default: `<apux-segment value='battery' icon='battery-charging'>Battery
      </apux-segment><apux-segment value='transformer' icon='transformer'>Transformer</apux-segment>`,
  },
};

export const WithDisabled: Story = {
  args: {
    Default: `
    <apux-segment value='dashboard-1' icon='dashboard-1'>Dashboard-1</apux-segment>
    <apux-segment value='dashboard-2' icon='dashboard-2'>Dashboard-2</apux-segment>
    <apux-segment disabled value='editor' icon='data-editor'>Editor</apux-segment>
    <apux-segment selected value='calendar' icon='calendar'>Calendar</apux-segment>
    `,
  },
};

export const Responsive: Story = {
  args: {
    Default: `
    <apux-segment value='night' icon='moon'>Dark Mode</apux-segment>
    <apux-segment value='day' icon='sun'>Light Mode</apux-segment>
    <apux-segment value='editor' icon='data-editor'>Editor</apux-segment>
    <apux-segment selected value='calendar' icon='calendar'>Calendar</apux-segment>
    `,
    orientation: "horizontal",
  },
  decorators: [responsive({ width: 300 })],
};

export const Orientation: Story = {
  name: "Orientation (Vertical)",
  args: {
    Default: `
    <apux-segment value='apple' icon='plus'>Apple</apux-segment>
    <apux-segment selected value='banana' icon='cart'>Banana</apux-segment>
    <apux-segment value='citrus' icon='globe'>Orange</apux-segment>
    `,
    orientation: "vertical",
  },
};

const events = actions("onClick", "onSubmit");

export const FormIntegration: Story = {
  render(args) {
    const submit = (ev: SubmitEvent) => {
      ev.preventDefault();
      const params = new URLSearchParams(
        new FormData(ev.currentTarget as HTMLFormElement) as unknown as Record<
          string,
          string
        >,
      );
      events.onSubmit(ev, params.toString());
    };
    return html` <form @submit=${submit}>${meta.render(args)}</form>`;
  },
  args: {
    Default: `
    <apux-segment value="list" name="list-view" icon="list">
      List
    </apux-segment>
    <apux-segment value="thumbnail" name="thumbnail-view" icon="thumbnail-view">
      Thumbnail
    </apux-segment>`,
  },
};

export const Events: Story = {
  args: {
    Default: `<apux-segment value='night' icon='moon'>Dark Mode</apux-segment>
    <apux-segment value='day' icon='sun'>Light Mode</apux-segment>`,
  },
};

export const IconOnly: Story = {
  args: {
    Default: `
    <apux-segment icon="list"></apux-segment>
    <apux-segment icon="thumbnail-view"></apux-segment>
    `,
  },
};

export const VariantDiscreet: Story = {
  name: "Variant: Discreet",
  args: {
    Default: `
    <apux-segment icon="align-left">Align Left</apux-segment>
    <apux-segment icon="align-right" selected>Align Right</apux-segment>
    `,
    variant: "discreet",
  },
};

export const Small: Story = {
  args: {
    Default: `
    <apux-segment icon="align-left">Align Left</apux-segment>
    <apux-segment icon="align-right">Align Right</apux-segment>
    `,
    size: "small",
  },
};

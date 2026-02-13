import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { responsive } from "../../utils/decorators.js";
import { paneVariants } from "@abb-hmi/apux/types";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { ifDefined } from "lit-html/directives/if-defined.js";

type Args = ApuxTabList & { Default: string; customStyle: string };

/**
 * The tab-list represents a collection of tabs with associated content.
 * Navigation through the tabs changes the content display of
 * the currently selected tab.
 */
const meta = {
  title: "General/Tab/Tab list",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description: `Stylistic variation`,
      type: {
        name: "enum",
        value: [...paneVariants],
      },
    },
  },
  render: ({ Default, variant, customStyle }) => {
    return html`<apux-tab-list
      variant=${variant}
      style=${ifDefined(customStyle)}
    >
      ${unsafeHTML(Default)}
    </apux-tab-list>`;
  },
  parameters: {
    actions: {
      handles: ["change", "close", "click"],
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export default meta;

export const Default: Story = {
  args: {
    Default: `<apux-tab icon="home">Home page</apux-tab
    ><apux-tab icon="matrix" closeable>Navigation</apux-tab
    ><apux-tab>Latest articles</apux-tab>`,
  },
};

export const Responsive: Story = {
  decorators: [responsive({ width: 600 })],
  args: {
    Default: `
    <apux-tab icon="home">Home page</apux-tab>
    <apux-tab icon="matrix" closeable>Navigation</apux-tab>
    <apux-tab icon="user">About Us</apux-tab>
    <apux-tab icon="call">Contact Us</apux-tab>
    <apux-tab icon="edit" closeable>Feedback</apux-tab>
    <apux-tab icon="moon" closeable>What we do</apux-tab>
    <apux-tab icon="dollar">Our Work</apux-tab>`,
    customStyle: "width: 100%",
  },
};

export const Variant: Story = {
  name: "Variant: Primary",
  args: {
    Default: `<apux-tab icon="home" closeable selected>Home page</apux-tab>`,
    variant: "primary",
  },
};

export const VariantSecondary: Story = {
  name: "Variant: Secondary",
  args: {
    Default: `
    <apux-tab icon="edit" closeable selected>Feedback</apux-tab>
    <apux-tab icon="dollar" closeable>Our Work</apux-tab>`,
    variant: "secondary",
  },
};

export const VariantSecondaryInverted: Story = {
  name: "Variant: Secondary Inverted",
  args: {
    Default: `
    <apux-tab icon="home" closeable selected>Home page</apux-tab>
    <apux-tab icon="call" closeable>Contact Us</apux-tab>`,
    variant: "secondary-inverted",
  },
  parameters: {
    backgrounds: { default: "Alternative" },
  },
};

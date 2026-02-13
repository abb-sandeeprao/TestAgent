import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";

type Args = ApuxDivider & { vertical: boolean };

/**
 * Divider `apux-divider` is a subtle, unobtrusive line used to separate
 * content horizontally or vertically.
 * It is used to group content visually into sections.
 *
 * **Remember that the divider's height and weight is determined by its content**.
 */
const meta = {
  title: "General/Divider",
  tags: ["autodocs"],
  render: ({ vertical }) => {
    return html`<apux-divider ?vertical=${vertical}></apux-divider>`;
  },
  argTypes: {
    vertical: {
      name: "vertical",
      type: "boolean",
      description: "If true, the divider is vertical",
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export default meta;

export const Horizontal: Story = {
  render(args) {
    return html`
      <apux-menu>
        <apux-menu-item icon="information-circle-1"
          >Show information</apux-menu-item
        >
        ${meta.render(args)}
        <apux-menu-item icon="list">Explore hierarchy</apux-menu-item>
        <apux-menu-item icon="user">Report user</apux-menu-item>
      </apux-menu>
    `;
  },
  args: {
    vertical: false,
  },
};

/**
 * Divider can be shown vertically to separate content in horizontal layouts.
 */
export const Vertical: Story = {
  render(args) {
    return html`<div style="display: flex; gap: 8px; height: 40px;">
      <apux-button variant="discreet">Select Date</apux-button>
      ${meta.render(args)}
      <apux-input type="date" />
    </div>`;
  },
  args: {
    vertical: true,
  },
};

import { Meta, StoryFn } from "@storybook/web-components";
import { html } from "lit-html";

type Args = ApuxDivider & { vertical: boolean };

/**
 * Divider `apux-divider` is used in the menu to separate groups of menu items.
 */
const meta = {
  title: "General/Menu/Divider in menu",
  tags: ["autodocs"],
  render: ({ vertical }) => {
    return html`<apux-divider ?vertical=${vertical}></apux-divider>`;
  },
} satisfies Meta<Args>;

export default meta;

export const Divider: StoryFn = () => {
  return html`<apux-menu>
    <apux-menu-item icon="information-circle-1"
      >Show information</apux-menu-item
    >
    <apux-divider></apux-divider>
    <apux-menu-item icon="list">Explore hierarchy</apux-menu-item>
    <apux-menu-item icon="user">Report user</apux-menu-item>
  </apux-menu>`;
};

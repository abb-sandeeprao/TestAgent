import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { Item, menuItems } from "./common.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxMenuHeader & { Default: string };

/**
 * Menu header `apux-menu-header` is to represent items.
 */
const meta = {
  title: "General/Menu/Header",
  tags: ["autodocs"],
  argTypes: {
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the header, can be text or HTML",
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Header: Story = {
  render({ Default }) {
    return html`<apux-menu>
      <apux-menu-header>${unsafeHTML(Default)}</apux-menu-header>
      ${menuItems.map(
        ({ label }: Item) => html`<apux-menu-item>${label}</apux-menu-item>`
      )}
    </apux-menu>`;
  },
  args: {
    Default: "Controls",
  },
};

import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxTag & { Default: string; close: never };

/**
 * Tag is a keyword or phrase which is associated with a piece of user-generated
 * content and can be used to group and categorize content,
 * making it easier to search for or discover related content.
 */
const meta = {
  title: "General/Tag",
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      name: "disabled",
      type: "boolean",
      description: "Prevents user interaction",
    },
    closeable: {
      name: "closeable",
      type: "boolean",
      description: "Shows the close icon",
    },
    line: {
      name: "line",
      type: "boolean",
      description: "Prevents text from wrapping and shows an ellipsis",
    },
    click: {
      table: { category: "Events" },
      description: "Fires when the user clicks on tag",
      type: { name: "function" },
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the tag, can be text or HTML",
    },
    close: {
      table: { category: "Events" },
      description: "Fires when the user clicks close icon on tag",
      type: { name: "function" },
    },
  },
  render({ disabled, closeable, Default, line }) {
    return html`<apux-tag
      ?disabled=${disabled}
      ?closeable=${closeable}
      ?line=${line}
      >${unsafeHTML(Default)}</apux-tag
    >`;
  },
  parameters: {
    actions: {
      handles: ["click", "close"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    Default: "Oriental Food",
  },
};

export const Disabled: Story = {
  args: {
    Default: "Funny cats",
    disabled: true,
  },
};

export const Closeable: Story = {
  args: {
    Default: "Classical music",
    closeable: true,
  },
};

/**
 * The click event is also triggered when the user presses
 * the **space** or **enter** key.
 */
export const Events: Story = {
  args: {
    Default: "Newest",
    closeable: true,
  },
};

/**
 * When activated, text in tag will display an **ellipsis** to represent clipped text, whenever there isn't enough place to
 * show the whole content.
 *
 * *Grab the dashed border from the right-bottom to change the size of the component*.
 */
export const Line: Story = {
  render(args) {
    return html`<div
      style="width: 300px; resize:horizontal; border: dashed var(--apux-state-info) 3px; padding:10px; overflow: hidden;"
    >
      ${meta.render(args)}
    </div>`;
  },
  args: {
    Default: "Pneumonoultramicroscopicsilicovolcanoconiosis",
    line: true,
    closeable: true,
  },
};

import { StoryObj, Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { iconNames } from "../../../apux/src/types.js";
import { clearItem } from "../../utils/args.js";

type Args = ApuxTab & { Default: string; change: never; close: never };

/**
 * A tab is a user interface component that allows users to
 * switch between different sections of content within the same space.<br>
 * There is a dedicated component to store several tabs named
 * "[Tab list](/docs/general-tab-tab-list--docs)".
 */
const meta = {
  title: "General/Tab/Tab",
  tags: ["autodocs"],
  argTypes: {
    selected: {
      type: "boolean",
      description: "Whether the tab is currently selected",
    },
    disabled: {
      name: "disabled",
      type: "boolean",
      description: "Prevents user interaction",
    },
    closeable: {
      name: "closeable",
      type: "boolean",
      description: "Shows the close button",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content/label for the tab, can be text or HTML",
    },
    icon: {
      name: "icon",
      control: { type: "select" },
      options: [clearItem, ...iconNames],
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed as part of the tab",
    },
    click: {
      table: { category: "Events" },
      description: "Fires when the user clicks on the tab or close button",
      type: { name: "function" },
    },
    change: {
      table: { category: "Events" },
      description: "Fires when new tab is clicked by user",
      type: { name: "function" },
    },
    close: {
      table: { category: "Events" },
      description: "Fires when the user clicks close icon on tab",
      type: { name: "function" },
    },
  },
  render: ({ disabled, selected, closeable, Default, icon }) => {
    return html`<apux-tab
      ?selected="${selected}"
      ?disabled=${disabled}
      ?closeable=${closeable}
      icon=${ifDefined(icon)}
      >${unsafeHTML(Default)}</apux-tab
    >`;
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
    Default: "Home page",
  },
};

/**
 * Represents the currently clicked tab.
 */
export const Selected: Story = {
  args: {
    Default: "Home page",
    selected: true,
  },
};

/**
 * A tab can be disabled to prevent user interaction.
 */
export const Disabled: Story = {
  args: {
    Default: "Home page",
    disabled: true,
    icon: "home",
    closeable: true,
  },
};

/**
 * When activated, it displays a close button.
 * Enabling the user to close the tab.
 * This only triggers the "close" event, it doesn't remove the tab from the DOM.
 */
export const Closeable: Story = {
  args: {
    Default: "Home page",
    closeable: true,
  },
};

/**
 * A tab can contain an icon prepended to its label.
 */
export const WithIcon: Story = {
  args: {
    Default: "Home page",
    icon: "home",
  },
};

/**
 * Text in tab will display an **ellipsis** to represent clipped text,whenever there isn't enough place to
 * show the whole content.
 *
 * *Grab the dashed border from the right-bottom to change the size of the component*.
 */
export const Responsiveness: Story = {
  render(args) {
    return html`<div
      style="width: 300px; resize:horizontal; border: dashed var(--apux-state-info) 3px; padding:10px; overflow: hidden;"
    >
      ${meta.render(args)}
    </div>`;
  },
  args: {
    Default: "Pneumonoultramicroscopicsilicovolcanoconiosis",
    icon: "sun",
    closeable: true,
  },
};

export const Events: Story = {
  args: {
    Default: "Home page",
    closeable: true,
  },
};

/**
 * - **Tab** navigates to the first non-disabled or selected tab.
 * - **Left arrow** focuses the previous tab of the tab list.
 * - **Right arrow** focuses the next tab of the tab list.
 * - **Space/Enter** selects already focused tab.
 * - **Ctrl + Space/Enter** triggers the close event of the tab.
 */
export const KeyboardInteractions: Story = {
  name: "Keyboard Interactions",
  render(args) {
    return html`<apux-tab-list
      >${meta.render(args)}<apux-tab icon="matrix" disabled>Menu</apux-tab
      ><apux-tab closeable icon="wrench">Tools</apux-tab
      ><apux-tab closeable selected>Updates</apux-tab></apux-tab-list
    >`;
  },
  args: {
    Default: "Home page",
    icon: "home",
  },
};

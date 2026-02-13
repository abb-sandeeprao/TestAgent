import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { Item, menuItems } from "./common.js";
import { componentSizes } from "@abb-hmi/apux/types";

type Args = Partial<ApuxMenu> & {
  Default: string;
  containerWidth?: number;
  containerTop?: number;
};

/**
 * A menu displays grouped navigation actions or selection options.
 * Each item is clickable element that triggers users actions.
 * The component may be used as context menu or navigation menu.
 */
const meta = {
  title: "General/Menu/Menu",
  tags: ["autodocs"],
  argTypes: {
    size: {
      description: `Vertical size of the menu items`,
      type: {
        name: "enum",
        value: [...componentSizes],
      },
    },
  },
  render({ size }) {
    return html`<apux-menu .size=${size}>
      ${menuItems.map(({ label }: Item) => {
        return html`<apux-menu-item>${label}</apux-menu-item>`;
      })}
    </apux-menu>`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Menu: Story = {};

export const Small: Story = {
  args: {
    size: "small",
  },
};

/**
 * - **Tab** at first pressed, navigates to the first menu item of the menu.
 * Then it navigates to last visited ones.
 * - **Up Arrow** navigates to the previous menu item.
 * - **Down Arrow** navigates to the next menu item.
 * - **Right Arrow**
 *      opens the submenu and navigate to its first available menu item.
 * - **Left Arrow** closes the submenu and navigate to the parent menu item.
 * - **Enter/Space** triggers the click event on the menu item.
 * - **Escape** triggers the close event.
 */
export const KeyboardInteractions: StoryObj = {
  render({ size }) {
    return html`<apux-menu .size=${size}
      ><apux-menu-item
        >1<apux-menu
          ><apux-menu-item>1.1</apux-menu-item
          ><apux-menu-item>1.2</apux-menu-item
          ><apux-menu-item>1.3</apux-menu-item></apux-menu
        ></apux-menu-item
      ><apux-menu-item disabled>2</apux-menu-item
      ><apux-menu-item
        >3<apux-menu
          ><apux-menu-item disabled>3.1</apux-menu-item
          ><apux-menu-item>3.2</apux-menu-item
          ><apux-menu-item
            >3.3<apux-menu
              ><apux-menu-item
                >3.3.1<apux-menu
                  ><apux-menu-item>3.3.1.1</apux-menu-item
                  ><apux-menu-item>3.3.1.2</apux-menu-item></apux-menu
                ></apux-menu-item
              ></apux-menu
            ></apux-menu-item
          ></apux-menu
        ></apux-menu-item
      >
      <apux-menu-item
        >4<apux-menu>
          <apux-menu-item disabled>4.1</apux-menu-item>
          <apux-menu-item disabled
            >4.2<apux-menu> <apux-menu-item>4.2.1</apux-menu-item></apux-menu>
          </apux-menu-item>
        </apux-menu>
      </apux-menu-item>
      <apux-menu-item>5</apux-menu-item>
    </apux-menu>`;
  },
  name: "Keyboard Interactions",
  args: {
    size: "medium",
  },
  parameters: {
    actions: {
      handles: ["close", "click apux-menu-item", "escape"],
    },
  },
};

/**
 * When there isn't enough space to display a submenu, the menu will reposition to fit the screen,
 * appearing on the right side of the parent menu item, or fit the view when not enough space on bottom.
 */
export const AutoPositionMenu: Story = {
  render({ size, containerWidth, containerTop }) {
    return html`<div style="position: relative;width: ${containerWidth}%; top: ${containerTop}vh;display: flex;justify-content: flex-end;align-items:flex-end">
  <apux-menu .size=${size}>
    <apux-menu-item>1
      <apux-menu>
        <apux-menu-item>1.1</apux-menu-item>
        <apux-menu-item>1.2</apux-menu-item>
        <apux-menu-item>1.3</apux-menu-item>
        <apux-menu-item>1.4</apux-menu-item>
       </apux-menu>
    </apux-menu-item>
    <apux-menu-item disabled>2</apux-menu-item>
    <apux-menu-item>3.3
      <apux-menu>
        <apux-menu-item>3.3.1
          <apux-menu>
            <apux-menu-item>3.3.1.1</apux-menu-item>
            <apux-menu-item>3.3.1.2</apux-menu-item>
          </apux-menu>
        </apux-menu-item>
      </apux-menu>
    </apux-menu-item>
    </apux-menu>
    </apux-menu-item>
  </apux-menu>
  </div>`;
  },
  name: "Auto position",
  argTypes: {
    containerWidth: {
      description: `Width of the container element for testing the auto position`,
      name: "container-width",
      type: {
        name: "number",
      },
    },
    containerTop: {
      description: `top position of the container element for testing the auto position`,
      name: "container-top",
      type: {
        name: "number",
      },
    },
  },
  args: {
    size: "medium",
    containerWidth: 100,
    containerTop: 80,
  },
  parameters: {
    actions: {
      handles: ["close", "click apux-menu-item", "escape"],
    },
  },
};

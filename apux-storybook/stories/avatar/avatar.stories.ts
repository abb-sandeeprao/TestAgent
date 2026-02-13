import { avatarSizes } from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";

type Args = ApuxAvatar & { Default: string };

/**
 * Avatar is used in displaying textual or visual content
 * to represent a user's identity or entity,
 * When name attribute is provided one character from first name and surname
 * is shown in avatar, If an image is provided it will be displayed.
 */
const meta = {
  title: "General/Avatar",
  tags: ["autodocs"],
  argTypes: {
    name: {
      type: "string",
      description:
        "User's full name, its initials will be displayed in the avatar",
    },
    src: {
      type: "string",
      description: "Path of image to be loaded",
    },
    size: {
      description: "Size of avatar",
      type: {
        name: "enum",
        value: [...avatarSizes],
      },
    },
  },
  render({ size, name, src }) {
    return html`<apux-avatar
      .size=${size}
      .name=${name}
      .src=${src}
    ></apux-avatar>`;
  },
  parameters: {
    actions: {
      handles: [],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const WithName: Story = {
  args: {
    name: "Thor",
  },
};

export const WithImage: Story = {
  args: {
    src: "portrait.png",
  },
};

export const Medium: Story = {
  args: {
    name: "Loki Asgard",
  },
};

export const Small: Story = {
  args: {
    src: "portrait.png",
    size: "small",
  },
};

export const ExtraSmall: Story = {
  args: {
    name: "Potato Vegetable",
    size: "extra-small",
  },
};

/**
 * When provided image path is invalid and no name attribute value is provided,
 * warning icon is displayed.
 */
export const WarningIcon: Story = {
  args: {
    name: "",
    src: "/errorPortrait.jpg",
  },
};

import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxCard & { Default: string };

/**
 * Card component is a panel or placeholder for a separated section of the UI.
 * It takes the content and separates it from the rest of the UI.
 * It acts as a regular div with some extra shadowing and borders.
 */
const meta = {
  title: "General/Card",
  tags: ["autodocs"],
  argTypes: {
    selected: {
      type: { name: "boolean" },
      description: "Highlight the card by adding an outline around it",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content for the dialog, can be text or HTML",
    },
  },
  render({ Default, selected }) {
    return html`<apux-card ?selected=${selected}
      >${unsafeHTML(Default)}</apux-card
    >`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Normal: Story = {
  args: {
    Default: `Peter Pan is a fictional character created by Scottish novelist
    and playwright J. M. Barrie. A free-spirited and mischievous young boy
    who can fly and never grows up, Peter Pan spends his never-ending
    childhood having adventures on the mythical island of Neverland as
    the leader of the Lost Boys, interacting with fairies, pirates, mermaids,
    Native Americans, and occasionally ordinary children from the world
    outside Neverland.`,
  },
};

export const Selected: Story = {
  args: {
    Default: `"Little Red Riding Hood" is a European fairy tale about
    a young girl and a sly wolf. Its origins can be traced back to several
    pre-17th century European folk tales. The two best known versions
    were written by Charles Perrault and the Brothers Grimm.`,
    selected: true,
  },
};

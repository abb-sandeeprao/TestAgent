import { userEvent } from "@storybook/testing-library";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import "./style.scss";

type Args = ApuxDetails & { Default: string; toggle: never };

/**
 * Creates an element that displays its content only when it
 * has the state `open`. A `summary` sub-element allows the user
 * to toggle the element.
 */
const meta = {
  title: "General/Details/Details",
  tags: ["autodocs"],
  argTypes: {
    expandOn: {
      type: {
        name: "enum",
        value: ["summary", "icon"],
      },
    },
    summary: {
      table: { category: "Slots" },
      description: "Displayed as the summary/header of the details",
      type: "string",
    },
    open: {
      type: "boolean",
      description: "Whether the details are expanded",
    },
    toggle: {
      table: { category: "Events" },
      description: "Fires when the user opens or closes the details",
      type: { name: "function" },
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content for the details, can be text or HTML",
    },
  },
  render({ summary, Default, open, expandOn }) {
    return html`<apux-details ?open=${open} .expandOn=${expandOn}
      >${summary
        ? html`<div slot="summary">${unsafeHTML(summary)}</div>`
        : null}${unsafeHTML(Default)}</apux-details
    >`;
  },
  parameters: {
    actions: {
      handles: ["toggle apux-details"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Basic: Story = {
  args: {
    Default: `is a fairy tale written by French novelist Gabrielle-Suzanne Barbot
    de Villeneuve and published in 1740 in La Jeune Américaine et les contes marins
    (The Young American and Marine Tales).`,
    summary: "Beauty and the Beast",
  },
};

export const Opened: Story = {
  args: {
    Default: `or "Little Briar Rose" (German: Dornröschen), also titled in English
  as "The Sleeping Beauty in the Woods", is a classic fairy tale about a princess
  who is cursed to sleep for a hundred years by an evil fairy, to be awakened
  by a handsome prince at the end of them.`,
    summary: "Sleeping Beauty",
    open: true,
  },
};

export const OpenWithIcon: Story = {
  args: {
    Default: `"Cinderella",or "The Little Glass Slipper", is a folk tale with 
  thousands of variants throughout the world. The protagonist is a young woman 
  living in forsaken circumstances that are suddenly changed to remarkable fortune, 
  with her ascension to the throne via marriage.`,
    summary: "Cinderella",
    open: true,
    expandOn: "icon",
  },
};

export const RichContent: Story = {
  args: {
    Default: `Can display <strong>any </strong> content <apux-icon name="bluetooth"></apux-icon>`,
    summary: `<span class="online"><apux-icon name="check-mark"></apux-icon> Online</span>`,
    open: true,
  },
};

export const Nested: Story = {
  render(args) {
    return html`<apux-details open>
        <div slot="summary">America</div>
        <apux-details open>
          <div slot="summary">Argentina</div>
          ${meta.render(args)}
          <apux-details
            ><div slot="summary">Neuquén</div>
            located in the west of the country
          </apux-details></apux-details
        >
      </apux-details>
      <apux-details open>
        <div slot="summary">Europe</div>
        <apux-details>
          <div slot="summary">Poland</div>
          <apux-details>
            <div slot="summary">Krakow</div>
            is the second-largest and one of the oldest cities in Poland
          </apux-details>
        </apux-details>
      </apux-details>`;
  },
  args: {
    summary: "Buenos Aires",
    Default: "is the largest and most populous Argentine province",
    open: true,
  },
};

export const Events: Story = {
  args: {
    Default: `is an English fairy tale. It appeared as "The Story of Jack Spriggins
   and the Enchanted Bean" in 1734[1] and as Benjamin Tabart's moralized
   "The History of Jack and the Bean-Stalk" in 1807.`,
    summary: "Jack and the Beanstalk",
  },
  play({ canvasElement }) {
    const summary = canvasElement.querySelector(`[slot="summary"]`)!;
    userEvent.click(summary);
  },
};

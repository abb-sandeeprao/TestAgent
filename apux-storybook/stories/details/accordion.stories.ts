import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";

type Args = ApuxAccordion & { Default: string };

/**
 * Optionally group a set of `apux-details`, it controls whether one
 * or multiple directly nested details can be open at the same time.
 */
const meta = {
  title: "General/Details/Accordion",
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      type: "boolean",
      description:
        "Allows to open multiple details at the same time, by default only one can be expanded",
    },
  },
  render({ multiple }) {
    return html`<apux-accordion ?multiple=${multiple}>
      <apux-details open
        ><div slot="summary">Chemistry</div>
        is the scientific study of the properties and behavior of matter.
      </apux-details>
      <apux-details open
        ><div slot="summary">Physics</div>
        is the natural science that studies matter.
      </apux-details>
      <apux-details open
        ><div slot="summary">Biology</div>
        is the scientific study of life.
      </apux-details>
    </apux-accordion>`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Single: Story = {
  args: {
    multiple: false,
  },
};

export const SingleNested: Story = {
  render(args) {
    return html`<apux-accordion ?multiple=${args.multiple}>
      <apux-details open
        ><div slot="summary">Other</div>
        ${meta.render(args)}
      </apux-details>
      <apux-details
        ><div slot="summary">Biology</div>
        is the scientific study of life.
      </apux-details>
    </apux-accordion>`;
  },
  args: {
    multiple: false,
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

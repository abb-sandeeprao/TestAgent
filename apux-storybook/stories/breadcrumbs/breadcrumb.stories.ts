import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = Partial<ApuxBreadcrumb> & { Default: string };

/**
 * Breadcrumb item describes the page we are on via icon or text,
 * which can further be used for forward or backward navigation.
 *
 * - **Tab** navigates & sets focus to the next breadcrumb.
 * - **Space key** sets the focused breadcrumb as active
 *      and dispatches a click event which can be captured by the user.
 * - **Enter key** sets the focused breadcrumb as active
 *      and dispatches a click event which can be captured by the user.
 *
 */
const meta = {
  title: "General/Breadcrumbs/Breadcrumb",
  tags: ["autodocs"],
  argTypes: {
    href: {
      type: "string",
      description: "Used for navigating to a specific page",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content for the breadcrumb, can be text or HTML",
    },
    click: {
      table: { category: "Events" },
      description: "fires when we click on breadcrumb",
      type: { name: "function" },
    },
  },
  render({ href, Default }) {
    return html` <apux-breadcrumb href=${ifDefined(href)}>
      ${unsafeHTML(Default)}</apux-breadcrumb
    >`;
  },
  parameters: {
    actions: {
      handles: ["click apux-breadcrumb"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const OneItem: Story = {
  args: {
    Default: "Dashboard",
  },
};

export const RichContent: Story = {
  args: {
    Default: `<apux-icon name='home'></apux-icon>  Atlantis`,
  },
};

/**
 * As a common practice, the last item selection in a breadcrumb disabled
 * and user interactions are prevented, hence it is recommended
 * to not add events or links to it.
 */
export const Events: Story = {
  render(args) {
    return html`${meta.render(args)}
      ${meta.render({ ...args, Default: "Cars" })}
      ${meta.render({ ...args, Default: "Electric" })}
      <apux-breadcrumb
        href="https://global.abb"
        @click=${(e: Event) => e.preventDefault()}
        >Autonomous (Default action prevented)</apux-breadcrumb
      >
      ${meta.render({ ...args, Default: "Land" })}`;
  },
  args: {
    Default: "<apux-icon name='home'></apux-icon>",
  },
};

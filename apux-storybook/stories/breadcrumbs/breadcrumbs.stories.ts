import { Meta, StoryFn } from "@storybook/web-components";
import { html } from "lit-html";

/**
 * Breadcrumbs are used as a secondary navigation aid that helps users easily
 * understand their location on a page,basically comprising of
 * multiple breadcrumb items.
 */
const meta: Meta = {
  title: "General/Breadcrumbs/Breadcrumbs",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryFn = () => {
  return html`<apux-breadcrumbs>
    <apux-breadcrumb><apux-icon name="home"></apux-icon></apux-breadcrumb>
    <apux-breadcrumb>Fire</apux-breadcrumb>
    <apux-breadcrumb>Wind</apux-breadcrumb>
  </apux-breadcrumbs>`;
};

import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { tooltipPlacement, tooltipVisibility } from "@abb-hmi/apux/types";
import "./styles.scss";
import { responsive } from "../../utils/decorators.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { TemplateResult } from "lit";

type Args = ApuxTooltip & { Default: string; tooltip: string };

/** @internal */
function render(
  content: TemplateResult,
  { header, text, tooltip, placement, visibility, interactive }: Args,
) {
  return html`<apux-tooltip
    header=${header}
    text=${text}
    .placement=${placement}
    .visibility=${visibility}
    ?interactive=${interactive}
    >${tooltip ? html` <div slot="tooltip">${unsafeHTML(tooltip)}</div>` : ""}
    ${content}</apux-tooltip
  >`;
}

/**
 * Tooltip is commonly used to show some extra information about
 * the specifically selected element in UI on mouse hover.
 *
 * The tooltip has the intention to show some complementary information
 * about the its associated element. This information should be a short text,
 * ideally one phrase. Avoid long content.
 */
const meta = {
  title: "General/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    header: {
      type: "string",
      description: "The header of the information displayed in the tooltip",
    },
    text: {
      type: "string",
      description: "The information displayed on the tooltip",
    },
    placement: {
      type: {
        name: "enum",
        value: [...tooltipPlacement],
      },
      description:
        "Position where the tooltip is displayed, relative to its content",
    },
    visibility: {
      description:
        "Controls whether the tooltip is displayed, the `on` option is recommended for debugging only",
      type: { name: "enum", value: [...tooltipVisibility] },
    },
    interactive: {
      description:
        "Allows pointer interactions with the content of the tooltip",
      type: "boolean",
    },
    tooltip: {
      table: { category: "Slots" },
      description: "The elements displayed on the tooltip",
      type: "string",
    },
  },
  decorators: [
    (story, { globals: { alignment }, parameters }) => {
      const align =
        alignment === "Left"
          ? "start"
          : alignment === "Center"
            ? "centered"
            : "end";
      const style = [
        parameters.centered
          ? `height: ${parameters.centered.height}px`
          : undefined,
        `justify-content: ${align}`,
      ].join("; ");
      return html`<div class="tooltip-context" style=${ifDefined(style)}>
        ${story()}
      </div>`;
    },
  ],
  render(args) {
    return render(html`<apux-button>Hover</apux-button>`, args);
  },
} as Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Textual: Story = {
  args: {
    text: "Click a button to activate its action",
    visibility: "on",
  },
  parameters: {
    centered: {
      height: 120,
    },
  },
};

/**
 * Tooltips should contain basic descriptions. Avoid styling.
 *
 * **DEPRECATED** Avoid its usage.
 */
export const TooltipSlot: Story = {
  args: {
    tooltip:
      "<apux-icon name='check-mark'></apux-icon> Click a button to <em>activate its action</em>",
  },
  parameters: {
    centered: {
      height: 150,
    },
  },
};

/**
 * Describes the main concept of the tip given to the user.
 */
export const Header: Story = {
  args: {
    visibility: "on",
    placement: "bottom",
    header: "A tooltip",
    text: "is used to display small tips or information to the user.",
  },
  parameters: {
    centered: {
      height: 190,
    },
  },
};

/**
 * Allows the user to interact with elements inside the tooltip.
 */
export const Interactive: Story = {
  args: {
    visibility: "on",
    placement: "bottom",
    interactive: true,
    tooltip: `The <a href="/">homepage</a> describes the main concepts of the library`,
  },
  parameters: {
    centered: {
      height: 150,
    },
  },
};

export const PlacementBottom: Story = {
  args: {
    visibility: "on",
    placement: "bottom",
    text: "At the bottom",
  },
};

export const PlacementTop: Story = {
  args: {
    visibility: "on",
    placement: "top",
    text: "At the top",
  },
};

export const PlacementRight: Story = {
  args: {
    visibility: "on",
    placement: "right",
    text: "At the right",
  },
};

export const PlacementLeft: Story = {
  args: {
    visibility: "on",
    placement: "left",
    text: "At the left",
  },
};

/**
 * In this visibility mode, the tooltip only appears when the content of the
 * container is wider than itself.
 */
export const VisibilityOverFlow: Story = {
  render({ text, placement, visibility }) {
    return html`<apux-tooltip
      style=${visibility === "overflow-x"
        ? "width: 100%; overflow-x: hidden; line; text-overflow: ellipsis; white-space: nowrap"
        : ""}
      text=${text}
      .placement=${placement}
      .visibility=${visibility}
    >
      <span
        >This is a very very very very very very very very very very long status
        message</span
      >
    </apux-tooltip>`;
  },
  decorators: [responsive({ width: 300 })],
  name: "Visibility: overflow-x",
  args: {
    visibility: "overflow-x",
    text: "Shown when text overflows tooltip container",
  },
};

export const PlacementPointer: Story = {
  render(args) {
    return html`<apux-field justify-content="space-between" style="width: 100%">
      ${render(html`<apux-button>Left</apux-button>`, args)}
      ${render(html`<apux-button>Middle</apux-button>`, args)}
      ${render(html`<apux-button>Right</apux-button>`, args)}
    </apux-field>`;
  },
  args: {
    placement: "pointer",
    text: "Following the mouse just because.",
  },
};

/**
 * The tooltip moves along with its target when parent container is scrolled,
 * be it horizontal or vertical scrolling.
 */
export const ScrollableTooltip: Story = {
  render(args) {
    return html`<div
      style="max-width: 500px; max-height: 250px; overflow:auto; padding: 30px;border: dashed var(--apux-status-info) 3px;"
    >
      <div style="width: 800px; height:800px;">
        ${render(html`<apux-button>Bottom</apux-button>`, args)}
      </div>
    </div>`;
  },
  args: {
    visibility: "on",
    text: "I will follow my target when it moves",
    placement: "bottom",
  },
};

/**
 * The tooltip is positioned in the expected place, even if the parent container has a scroll,
 * be it horizontal or vertical scrolling.
 */
export const TooltipWithParentScrolls: Story = {
  render(args) {
    return html`<div
        style="max-width: 500px; max-height: 250px; overflow:auto; padding: 30px;border: dashed var(--apux-status-info) 3px;"
      >
        <div
          style="width: 30px; height:350px;display:flex; flex-direction: column; gap: 20px;"
        >
          ${render(
            html`<apux-icon name="user" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="edit" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="view" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="usb" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="time" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="trend-1" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="trend-2" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="touch" size="medium"></apux-icon>`,
            args,
          )}
        </div>
      </div>

      <div
        style="max-width: 500px; max-height: 250px; overflow:auto; padding: 30px;border: dashed var(--apux-status-info) 3px;
        margin-left: 160px;"
      >
        <div style="width: 200px; height:20px;display:flex; gap: 20px;">
          ${render(
            html`<apux-icon name="user" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="edit" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="view" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="usb" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="time" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="trend-1" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="trend-2" size="medium"></apux-icon>`,
            args,
          )}
          ${render(
            html`<apux-icon name="touch" size="medium"></apux-icon>`,
            args,
          )}
        </div>
      </div>`;
  },
  args: {
    visibility: "hover",
    text: "I will follow my target when it moves",
    placement: "bottom",
  },
};

/**
 * The example shows that a tooltip will appear in expected position,
 * even if the parent has transform, container-type and other attribute that affects
 * positioning of a fixed element(tooltip in this case).
 */
export const ParentWithTransformProp: Story = {
  render(args) {
    return html` <div style="transform: scale(1);width: 100%; height: 100%;">
      <div
        style="container-type: inline-size; transform: scale(1); display:flex;justify-content: center"
      >
        ${render(html`<apux-button>Transformer</apux-button>`, args)}
      </div>
    </div>`;
  },
  args: {
    visibility: "hover",
    text: "My parent/ancestor has a transform property",
    placement: "bottom",
  },
};

/**
 * The tooltip places itself automatically on the other side of its preferred placement
 * - If the tooltip is preferred at the bottom, but there is no space under its holder:
 * it will appear on the top (and vice-versa).
 * - If the tooltip is preferred at the right, but there is no space next to its holder:
 * it will appear on the left (and vice-versa).
 */
export const TooltipRelocation: Story = {
  render(args) {
    return html` <div style="min-height:300px;">
      <div style="position:absolute; bottom:60px;">
        ${render(html`<apux-button>Bottom</apux-button>`, args)}
      </div>
      <div style="position:absolute; top:60px;">
        ${render(html`<apux-button>Top</apux-button>`, args)}
      </div>
      <div style="position:absolute; top:50%; left:60px;">
        ${render(html`<apux-button>Left</apux-button>`, args)}
      </div>
      <div style="position:absolute; top:50%; right:60px;">
        ${render(html`<apux-button>Right</apux-button>`, args)}
      </div>
    </div>`;
  },
  args: {
    visibility: "hover",
    text: "Tooltip can relocate itself to available placement",
    placement: "top",
  },
};

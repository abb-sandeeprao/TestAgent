import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { userEvent, within } from "@storybook/testing-library";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = Omit<ApuxDialog, "style"> & {
  Default: string;
  close: never;
  headerSlot: string;
  actions: string;
  noClose: boolean;
  style?: string;
  freeMode: boolean;
  resize: boolean;
  keepInWindow?: string;
};

/**
 * Dialog is a component for showing messages to the user.
 * It can provide a content put inside a default slot.
 * Buttons can be attached to the `actions` slot can let user make a decision.
 * A dialog can be shown on-demand via the attributes `modal` and `open`.
 * The auto focus after opening the dialog is disabled with use of the `inert` property.
 * The `type` `"error"` attribute makes modal to be considered a general error.
 *
 * **Live updates in docs are not expected to work**.
 */
const meta = {
  title: "General/Dialog",
  tags: ["autodocs"],
  argTypes: {
    header: {
      type: "string",
      description: "Text displayed in the title bar of the dialog",
    },
    state: {
      type: { name: "enum", value: ["default", "error"] },
      description: "Type/intention of the dialog",
    },
    opened: {
      type: "boolean",
      description: "Whether the dialog is opened/displayed or closed/hidden",
    },
    modal: {
      type: "boolean",
      description:
        "Display the dialog in modal mode, an overlay will hide the rest of the page",
    },
    draggable: {
      type: "boolean",
      description:
        "Makes the dialog draggable, it works only in non-modal mode, and it is enumerated, not a boolean.",
    },
    keepInWindow: {
      type: "string",
      name: "keep-in-window",
      if: { arg: "draggable" },
      description:
        "Ensures that the dialog remains within the visible bounds of the window when it is resized. Size in rem or px (e.g., '2rem' or '32px')",
    },
    noClose: {
      name: "no-close",
      type: "boolean",
      description: "Whether the close modal icon is displayed or hidden",
    },
    close: {
      table: { category: "Events" },
      description: "Fires when the user requests to close the dialog",
      type: { name: "function" },
    },
    freeMode: {
      name: "free-mode",
      type: "boolean",
      description:
        "The free mode removes all the padding and margins from the dialog, allowing the user to create a custom layout",
    },
    resize: {
      type: "boolean",
      description:
        "Determines whether the dialog can be resized by the user. Set to true to enable resizing.",
    },
    headerSlot: {
      table: { category: "Slots" },
      name: "header",
      description:
        "Replaces the header of the dialog, overriding all other header settings",
      type: "string",
    },
    actions: {
      table: { category: "Slots" },
      description: "Displayed as a bar at the bottom of the component",
      type: "string",
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description: "Any content for the dialog, can be text or HTML",
    },
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  render({
    Default,
    header,
    modal,
    opened,
    state,
    actions,
    draggable,
    keepInWindow,
    headerSlot,
    noClose,
    style,
    resize,
    freeMode,
  }) {
    const actionSlot = actions
      ? html`<div slot="actions">${unsafeHTML(actions)}</div>`
      : null;
    const headerSlotOuter = headerSlot
      ? html`<div slot="header">${unsafeHTML(headerSlot)}</div>`
      : null;
    const stateProp = state;
    return html`<apux-dialog
      ?opened=${opened}
      draggable=${ifDefined(draggable)}
      ?no-close=${noClose}
      ?modal=${modal}
      ?free-mode=${freeMode}
      ?resize=${resize}
      keep-in-window=${ifDefined(keepInWindow)}
      header=${ifDefined(header)}
      state=${ifDefined(stateProp)}
      style=${ifDefined(style)}
      >${unsafeHTML(Default)}${actionSlot}${headerSlotOuter}
    </apux-dialog>`;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Inlined: Story = {
  args: {
    header: "Strange Case of Dr Jekyll and Mr Hyde",
    Default: `is a Gothic novella by Scottish author Robert Louis Stevenson,
  first published in 1886. The work is also known as The Strange Case of 
  Dr. Jekyll and Mr. Hyde, Dr. Jekyll and Mr. Hyde, or simply Jekyll and Hyde.`,
    opened: true,
  },
};

/**
 * The modal option is exclusively used to block the rest of the page, it is not meant to be used
 * for regular notifications or user interactions. Avoid its usage for non-critical messages.
 *
 * It casts a backdrop over the rest of the page, making it impossible to interact with the rest of the page.
 */
export const Modal: Story = {
  args: {
    header: "Rumpelstiltskin",
    Default: `is a German fairy tale. It was collected by the Brothers Grimm 
    in the 1812 edition of Children's and Household Tales.
    The story is about a little imp who spins straw into gold in exchange
    for a girl's <apux-tooltip text="the first given child" placement="right">firstborn child</apux-tooltip>.`,
    modal: true,
    opened: true,
  },
};

/**
 * The error state is used to indicate that the dialog is showing an error message, it may be a recoverable
 * error or a fatal one.
 */
export const Errored: Story = {
  args: {
    header: "Wicked Witch of the West",
    Default: `The Wicked Witch of the West is a fictional character
  who appears in the classic children's novel The Wonderful Wizard of Oz (1900),
  created by American author L. Frank Baum. In Baum's subsequent Oz novels,
  it is the Nome King who is the principal villain; the Wicked Witch of the West
  is rarely even referred to again after her death in the first book.`,
    modal: true,
    opened: true,
    state: "error",
  },
};

/**
 * The action slot is used to provide buttons to the user, these buttons can be used to make a decision.
 * It is the preferred way to keep a "dialog" between the user and the application.
 */
export const Actions: Story = {
  args: {
    header: "Atlantis",
    Default: ` is a fictional island mentioned in an allegory on the hubris
  of nations in Plato's works Timeous and his friend, wherein it represents the antagonist
  naval power that besieges "Ancient Athens", the pseudo-historic embodiment of Plato's
  ideal state in The Republic.`,
    modal: true,
    opened: true,
    actions: `<apux-button>Cancel</apux-button>
    <apux-button variant="primary">Destroy and sink</apux-button>`,
  },
};

/**
 * Some dialogs are meant to be dismissed, use this attribute only when a user is forced to make a decision.
 */
export const ActionsWithoutCloseIcon: Story = {
  args: {
    header: "Dialog without close icon",
    Default: ` A dialog where close icon is hidden, such a dialog can be used 
    to force user's to take a decision which can otherwise be ignored by pressing close button.`,
    modal: true,
    opened: true,
    actions: `<apux-button>Cancel</apux-button>
    <apux-button variant="primary">Save</apux-button>`,
    noClose: true,
  },
};

/**
 * Dialogs can be placed over other elements, they are always on top of the rest of the page.
 */
export const OverOtherElements: Story = {
  render: (args) =>
    html`${meta.render(args)}
      <div style="background: lightblue; position: absolute; z-index: 999">
        Oceans have 999 z-index.
      </div>`,
  args: {
    header: "Sky",
    Default: `The sky is always over the earth and the oceans.`,
    modal: true,
    opened: true,
  },
};

/**
 * Explore the events emitted by the dialog component in the story view.
 */
export const Events: Story = {
  render(args, ctx) {
    const dialog = meta.render(args);
    const clickListener = () => {
      const dialog = ctx.canvasElement.querySelector("apux-dialog")!;
      dialog.opened = true;
    };
    return html`${dialog}
      <apux-button primary @click="${clickListener}">Re-open</apux-button>`;
  },
  args: {
    header: "Pinocchio",
    Default: `is a fictional character and the protagonist of the children's novel
    The Adventures of Pinocchio (1883) by Italian writer Carlo C. of Florence, Tuscany.`,
    modal: true,
    opened: true,
  },
  parameters: {
    actions: {
      handles: ["close"],
    },
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole<ApuxDialog>("dialog");
    const closeButton = dialog.internals.closeButton;
    userEvent.click(closeButton);
  },
};

/**
 * This story demonstrates how to use the `header` slot to replace the default header.
 * All settings for the header are overridden by the slot. As a result, the close icon is not shown.
 */
export const HeaderSlot: Story = {
  args: {
    header: "Not shown",
    headerSlot: `<h1>Header slot</h1>`,
    Default: `This dialog has a custom header.`,
    modal: true,
    opened: true,
  },
};

/**
 * A dialog can have custom dimensions specified by the `style` attribute.
 */
export const CustomDimensions: Story = {
  args: {
    header: "Custom dimensions",
    Default: `This dialog has custom dimensions. <div style="height:300px; background: black"></div> It is 500px wide and 400px tall.`,
    opened: true,
    style: "width: 500px; height: 400px;",
    actions: `<apux-button variant="primary">Save</apux-button>`,
  },
};

/**
 * The free mode removes all the padding and margins from the dialog,
 * additionally it hides the action slot. This allows to create a custom layout.
 *
 * The header slot is normally used with this mode to also customize the header.
 */
export const FreeMode: Story = {
  args: {
    header: "Free mode",
    Default: `This dialog is in free mode. It has no padding or margins.`,
    opened: true,
    freeMode: true,
  },
};

/**
 * The draggable dialog allows users to move it around the screen by dragging the header.
 * When the dialog is draggable, the backdrop is hidden, enabling a more flexible interaction.
 * Users can reposition the dialog by clicking and dragging its header, and it will remain
 * in place where the mouse is released.
 *
 * Note that the dialog will not be draggable if it is set to modal mode.
 * If both modal and draggable prop/attr are set, dialog will be modal and not draggable.
 *
 * **Warning:** This is enumerated, not a boolean, if used as attribute, it must be `draggable="true"`.
 */
export const Draggable: Story = {
  args: {
    header: "Draggable dialog",
    Default: `You can drag me around, but I've got my limits! 🚫<br><br>
    I love to explore, but I won't wander off the screen. Keep me within the boundaries, and let's make this space our playground! 🎈<br><br>
    Grab my header and let's roll, but remember: no peeking outside the window`,
    draggable: true,
    opened: true,
    style: "width: 500px;",
  },
};

/**
 * The keep-in-window option ensures that the dialog remains within the visible bounds of the window when it is resized,
 * at least partially, giving the user the ability to move it back into view.
 *
 * Resize the window to see how the dialog adjusts its position to stay within the viewport.
 */
export const KeepInWindow: Story = {
  name: "Draggable with keep-in-window",
  args: {
    header: "Draggable dialog",
    Default: `You can drag me around, but I've got my limits! 🚫<br><br>
    I love to explore, but I won't wander off the screen. Keep me within the boundaries, and let's make this space our playground! 🎈<br><br>
    Grab my header and let's roll, but remember: no peeking outside the window`,
    draggable: true,
    keepInWindow: "2rem",
    opened: true,
    style: `width: 500px; left: ${window.innerWidth - 16}px; top: 100px;`,
  },
};

/**
 * The resizable dialog allows users to adjust its dimensions by dragging from any corner or edge.
 * This flexibility enables a customized layout, making it easy to fit the content perfectly.
 * Users can resize the dialog while ensuring it remains within the screen boundaries,
 * creating a user-friendly experience for content adjustment.
 *
 * Note that the dialog can be set to modal mode, which affects its interaction with underlying elements.
 */
export const Resizable: Story = {
  args: {
    header: "Resizable",
    Default: `Feel free to stretch me out or pinch me in! 📏<br><br> I love a good makeover, so resize me from any corner or edge. Let's find the perfect fit for our conversation! <br><br> Remember, I'm flexible, but I'll always keep my shape within the screen. Let's shape this space together! ✂️`,
    opened: true,
    style: "width: 300px;",
    modal: true,
    resize: true,
  },
};

/**
 * Dialogs can be stacked on top of each other, creating a layered effect.
 * This stacking allows users to interact with multiple dialogs simultaneously.
 *
 * Clicking on a dialog brings it to the front.
 *
 */

export const Stacking: Story = {
  render: (args) => html`
    <div style="position: relative; z-index: 1;">
      ${meta.render({
        ...args,
        opened: true,
        style:
          "width: 300px; position: absolute; top: 50px; left: 0px; transform: translateZ(0);",
        header: "Dialog 1 - Welcome",
        Default: `Welcome to the first dialog! 📚 This is where the adventure begins. Feel free to explore or take action.<br><br> Let's make this the start of something amazing!`,
      })}
      ${meta.render({
        ...args,
        opened: true,
        style:
          "width: 300px; position: absolute; top: 80px; left: 100px; transform: translateZ(-10px);",
        header: "Dialog 2 - Discovery",
        Default: `You've moved to the second dialog. 🧭 Here's where you'll discover new possibilities.<br><br> Resize, interact, and let's see where this journey leads!`,
      })}
      ${meta.render({
        ...args,
        opened: true,
        style:
          "width: 300px; position: absolute; top: 100px; left: 200px; transform: translateZ(-20px);",
        header: "Dialog 3 - Final Chapter",
        Default: `The third and final dialog of this stack. 📜 You've reached the end of this series of dialogs.<br><br> But remember, the journey never truly ends!`,
      })}
    </div>
  `,
  args: {
    header: "Dialog Stack",
    opened: true,
    style: "width: 300px;",
    draggable: true,
    resize: true,
  },
};

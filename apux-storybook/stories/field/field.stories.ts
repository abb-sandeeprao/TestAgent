/* eslint-disable jsdoc/require-description-complete-sentence */
import { Meta, StoryFn, StoryObj } from "@storybook/web-components";
import { html, TemplateResult } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { actions } from "@storybook/addon-actions";
import {
  direction,
  fieldLabelPositions,
  justifyContent,
  alignItems,
  decision,
} from "../../../apux/src/types.js";
import { responsive } from "../../utils/decorators.js";

type Args = Partial<ApuxField> & { Default: string };

const decorateTemplate =
  (content: TemplateResult): StoryFn<Args> =>
  ({
    label,
    labelSuffix,
    description,
    labelPosition,
    direction,
    alignItems,
    required,
    disabled,
    justifyContent,
    wrap,
  }) => {
    return html`<apux-field
      label=${ifDefined(label)}
      label-suffix=${ifDefined(labelSuffix)}
      description=${ifDefined(description ?? undefined)}
      label-position=${ifDefined(labelPosition)}
      direction=${ifDefined(direction)}
      align-items=${ifDefined(alignItems)}
      required=${ifDefined(required)}
      disabled=${ifDefined(disabled)}
      justify-content=${ifDefined(justifyContent)}
      ?wrap=${wrap}
    >
      ${content}
    </apux-field>`;
  };

/**
 * A field is a wrapper for an APUX element (or any HTML element) which
 * provides a label, a description and standard spacing.
 * The main goal of fields is to create very user-oriented forms that keep
 * the semantics of the web, allow mouse and keyboard interactions
 * and format the controls pleasantly to the eye.
 *
 * **An example of a field:**
 *
 * <apux-field label="Some label"
 *    description="A detailed description that indicates the usage">
 *     <div style="border: dashed var(--apux-state-info) 3px; height: 32px"></div>
 * </apux-field>
 *
 * The dotted area is meant to be replaced with any control,
 * as exemplified in the following stories.
 *
 * Fields make the inner control to be displayed as a block.
 * It is up to an outer element, most probably the `<form>`,
 * to control the width of the field/control pair.
 * This allows developers to freely compose their fields in columns
 * or any other custom layout.
 *
 * Additionally, fields also add visual indication of the controls
 * that are required or have validation errors.
 *
 */
const meta = {
  title: "Form/Field",
  tags: ["autodocs"],
  argTypes: {
    label: {
      type: "string",
      description: "Displayed text next the control to indicate its purpose",
    },
    labelSuffix: {
      type: "string",
      name: "label-suffix",
      description:
        "Displayed after the main label for secondary information about the field. For example: status, ownership,...",
    },
    description: {
      type: "string",
      description:
        "Displayed text under the control to instruct about its purpose",
    },
    labelPosition: {
      type: { name: "enum", value: [...fieldLabelPositions] },
      name: "label-position",
      description:
        "Position where the label is displayed in relation to the control",
    },
    direction: {
      type: { name: "enum", value: [...direction] },
      description: "Direction of controls in the field",
    },
    alignItems: {
      type: { name: "enum", value: [...alignItems] },
      name: "align-items",
      description: "Indicates how the items are laid out along the cross axis",
    },
    justifyContent: {
      type: { name: "enum", value: [...justifyContent] },
      name: "justify-content",
      description: "Indicates how the items are laid out along the main axis",
    },
    wrap: {
      type: "boolean",
      description:
        "Indicates if the items should wrap when there is not enough space",
    },
    disabled: {
      type: { name: "enum", value: [...decision] },
      description:
        "Represents if a child control is disabled. By default, if a child is disabled, the field is also disabled",
    },
    required: {
      type: { name: "enum", value: [...decision] },
      description:
        "Represents if a child control is required. By default, if a child is required, the field is also required.Indicates how the items are laid out along the cross axis",
    },
  },
  render: decorateTemplate(
    html`<apux-input value="UFOs in Roswell, New Mexico"></apux-input>`,
  ),
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

/**
 * The label can be declared as an attribute of the element.
 */
export const Label: Story = {
  args: { label: "Favorite conspiracy theory" },
};

/**
 * The label suffix allows to add additional information to the label,
 * this information can be percentages/fractions (as in the progress bar),
 * ownership of a resource, or any other information that sets the context of
 * the field.
 */
export const LabelSuffix: Story = {
  args: { label: "Favorite crime story", labelSuffix: "related to UFO" },
};

/**
 * The description can be declared as an attribute of the element.
 */
export const Description: Story = {
  args: {
    description:
      "The name of the most exciting conspiracy theory in your opinion",
  },
};

/**
 * The label can be declared in a slot. Therefore, any HTML can be used.
 */
export const LabelSlotted: Story = {
  name: "Label (Slotted)",
  render(args, ctx) {
    const { label, ...rest } = args;
    return decorateTemplate(
      html`<div slot="label">${unsafeHTML(label)}</div>
        <apux-input value="Majestic 12"></apux-input>`,
    )(rest, ctx);
  },
  args: {
    label: "Favorite conspiracy theory about <apux-tag>aliens</apux-tag>",
  },
};

/**
 * The label will be in disabled state when the field contains
 * a disabled control.
 */
export const LabelDisabled: Story = {
  render(args, ctx) {
    const { label, ...rest } = args;
    return decorateTemplate(
      html`<div slot="label">${unsafeHTML(label)}</div>
        <apux-input disabled value="Peter Pan"></apux-input>`,
    )(rest, ctx);
  },
  name: "Label (With Disabled Control)",
  args: {
    label: "Your Name",
  },
};

/**
 * The description can be declared in a slot. Therefore, any HTML can be used.
 */
export const DescriptionSlotted: Story = {
  name: "Description (Slotted)",
  render(args, ctx) {
    const { description, ...rest } = args;
    return decorateTemplate(
      html`<div slot="description">${unsafeHTML(description)}</div>
        <apux-input value="Majestic 12"></apux-input>`,
    )(rest, ctx);
  },
  args: {
    description:
      "The <strong>best conspiracy</strong> theory ever according to <apux-tag>Roger Smith</apux-tag>",
  },
};

/**
 * By default, when the field contains a required control
 * (or any HTML element with the attribute `required`),
 * the label will have a visual indication.
 *
 * Additionally, the field can be marked as `required="yes"`
 * to force the behavior. Also, the field can be marked as `required="no"` to
 * fully disable the behavior.
 *
 * Using `required="yes"` doesn't enforce the field to be required when
 * the form is submitted. It only adds a visual indication.
 */
export const Required: Story = {
  render: (args, ctx) =>
    html`<h4>Required input control:</h4>
      ${decorateTemplate(
        html`<apux-input required value="Cosmic Watergate"></apux-input>`,
      )(args, ctx)}
      <h4>Non-required input control:</h4>
      ${decorateTemplate(
        html`<apux-input value="Cosmic Watergate"></apux-input>`,
      )(args, ctx)}
      <p>Test the <strong>required</strong> attribute</p>`,
  args: {
    label: "Your favorite conspiracy theory",
  },
};

/**
 * When the field contains a disabled control
 * (or any HTML element with the attribute `disabled`),
 * the label will have a visual indication.
 *
 * Additionally, the field can be marked as `disabled="yes"`
 * to force the behavior. Also, the field can be marked as `disabled="no"` to
 * fully disable the behavior.
 *
 * Using `disabled="yes"` doesn't enforce the child controls to be disabled.
 */
export const Disabled: Story = {
  render: (args, ctx) =>
    html`<h4>Disabled input control:</h4>
      ${decorateTemplate(
        html`<apux-input disabled value="Cosmic Watergate"></apux-input>`,
      )(args, ctx)}
      <h4>Non-disabled input control:</h4>
      ${decorateTemplate(
        html`<apux-input value="Cosmic Watergate"></apux-input>`,
      )(args, ctx)}
      <p>Test the <strong>disabled</strong> attribute</p>`,
  args: {
    label: "Your favorite conspiracy theory",
    description:
      "The name of the most exciting conspiracy theory in your opinion",
  },
};

const events = actions("onSubmit");

const majesticDescription = [
  "Also known as MJ-12 for short, it is a famous UFO incident ",
  "about the recovery of an alien spacecraft, popular in television, film and literature.",
  "",
  "On May 31, 1987 UFO documents were reported.",
].join("\n");

/**
 * This example shows how to use the `<apux-field>` element in a form.
 *
 * It should be used as the way to layout the form controls.
 */
export const Form: Story = {
  name: "Form (example)",
  render(args, ctx) {
    const onSubmit = function (this: HTMLFormElement, event: SubmitEvent) {
      event.preventDefault();
      const data = new FormData(this);
      const params = new URLSearchParams(
        data as unknown as undefined,
      ).toString();
      events.onSubmit({ event, params });
    };
    return html`<form @submit=${onSubmit}>
      ${decorateTemplate(
        html`<apux-input
          name="incident"
          required
          value="Majestic 12"
        ></apux-input>`,
      )(args, ctx)}
      ${decorateTemplate(
        html`<apux-textarea
          name="details"
          rows="6"
          required
          .value=${majesticDescription}
        ></apux-textarea>`,
      )(
        {
          ...args,
          label: "Details of the incident",
          description: "Describe the events in details.",
        },
        ctx,
      )}
      ${decorateTemplate(
        html`<apux-select name="category" required>
          <apux-option value="ufo" selected>UFO</apux-option>
          <apux-option value="corruption">Corruption</apux-option>
          <apux-option value="reptilians">Reptilians</apux-option>
        </apux-select>`,
      )(
        {
          ...args,
          label: "Category",
          description: "Select the category that describes the incident.",
        },
        ctx,
      )}
      <apux-button variant="primary">Report sighting</apux-button>
    </form>`;
  },
  args: {
    label: "Incident",
    description: "Report in few words the event.",
  },
};

/**
 * The label can be positioned in the front of the control,
 * instead of above it.
 * This is useful when the control is a single line control.
 */
export const LabelPositionFront: Story = {
  render: decorateTemplate(
    html`<apux-input required placeholder="YYYY"></apux-input>
      <apux-input required placeholder="MM"></apux-input>
      <apux-input required placeholder="DD"></apux-input>`,
  ),
  name: "Label (Position: Front)",
  args: {
    labelPosition: "front",
    label: "Day of the sight",
    description: "When did the incident happen?",
  },
};

/**
 * The field can contain multiple controls. They can be positioned
 * horizontally.
 *
 * A gap is added between the controls.
 */
export const MultipleControlsHorizontal: Story = {
  render: decorateTemplate(
    html`<apux-input required placeholder="Sighting report"></apux-input>
      <apux-input type="number" required placeholder="Years ago"></apux-input>
      <apux-select>
        <apux-option value="ufo" selected>UFO</apux-option>
        <apux-option value="corruption">Corruption</apux-option>
      </apux-select>`,
  ),
  name: "Multiple Controls (Horizontal)",
  args: { label: "Detailed incident report", description: "Report in details" },
};

/**
 * The field can contain multiple controls. They can be positioned
 * vertically.
 *
 * A gap is added between the controls.
 */
export const MultipleControlsVertical: Story = {
  render(args, ctx) {
    return html`
      ${decorateTemplate(
        html`<apux-input required placeholder="Sighting report"></apux-input>
          <apux-input
            type="number"
            required
            placeholder="Years ago"
          ></apux-input>
          <apux-select>
            <apux-option value="ufo" selected>UFO</apux-option>
            <apux-option value="corruption">Corruption</apux-option>
          </apux-select>`,
      )(args, ctx)}
      ${decorateTemplate(html`
        <apux-radio name="reporter" value="me" checked>Me</apux-radio>
        <apux-radio name="reporter" value="relative">Relative</apux-radio>
        <apux-radio name="reporter" value="friend">Friend</apux-radio>
      `)(
        {
          ...args,
          label: "Sighted by",
          description: undefined,
          alignItems: "start",
        },
        ctx,
      )}
    `;
  },
  name: "Multiple Controls (Vertical)",
  args: {
    label: "Detailed incident report",
    direction: "vertical",
    description: "Report in details",
  },
};

/**
 * It is possible to use the `align-items` property to align the controls,
 * these match the flexbox values.
 *
 * In this example, the controls are aligned horizontally in the center.
 *
 * More info: https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
 */
export const AlignItemsCenter: Story = {
  render: decorateTemplate(
    html`<apux-input required placeholder="Sighting report"></apux-input>
      <apux-input type="number" required placeholder="Years ago"></apux-input>
      <apux-checkbox name="reporter" value="me" checked>Me</apux-checkbox> `,
  ),
  name: "Align Items (Center / Horizontal)",
  args: {
    label: "Sighted by",
    alignItems: "center",
  },
};

/**
 * It is possible to use the `align-items` property to align the controls.
 *
 * In this example, the controls are aligned vertically at the start.
 *
 * More info: https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
 */
export const AlignItemsStart: Story = {
  render: decorateTemplate(
    html`<apux-input required placeholder="Sighting report"></apux-input>
      <apux-input type="number" required placeholder="Years ago"></apux-input>
      <apux-checkbox name="reporter" value="me" checked>Me</apux-checkbox> `,
  ),
  name: "Align Items (Start / Vertical)",
  args: {
    label: "Sighted by",
    alignItems: "start",
    direction: "vertical",
  },
};

const renderJustifyContent = decorateTemplate(html`
  <apux-radio name="reporter" value="extraterrestrial" checked
    >Extraterrestrial</apux-radio
  >
  <apux-radio name="reporter" value="marine">Marine</apux-radio>
  <apux-radio name="reporter" value="military">Military</apux-radio>
  <apux-radio name="reporter" value="scientist">Scientist</apux-radio>
  <apux-radio name="reporter" value="other">Other</apux-radio>
`);

/**
 * It is possible to use the `justify-content` property to align the controls.
 * These match the flexbox values.
 *
 * In this example, the controls are aligned horizontally at the start.
 *
 * More info: https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
 */
export const JustifyContentStart: Story = {
  render: renderJustifyContent,
  name: "Justify Content (Start)",
  args: {
    label: "Type of phenomenon",
    justifyContent: "start",
  },
};

/**
 * It is possible to use the `justify-content` property to align the controls.
 * These match the flexbox values.
 *
 * In this example, the controls are distributed horizontally, keeping the
 * space between them regular.
 *
 * More info: https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
 */
export const JustifyContentSpaceBetween: Story = {
  render: renderJustifyContent,
  name: "Justify Content (Space Between)",
  args: {
    label: "Type of phenomenon",
    justifyContent: "space-between",
  },
};

/**
 * The `wrap` property allows the controls to wrap when the space is not enough.
 */
export const Wrap: Story = {
  render: renderJustifyContent,
  decorators: [responsive({ width: 300 })],
  args: {
    label: "Sighted by",
    wrap: true,
    justifyContent: "start",
  },
};

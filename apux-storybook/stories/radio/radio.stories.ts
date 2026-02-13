import { actions } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { ApuxRadio } from "../../../apux/src/components/radio/radio.js";

type Args = Partial<ApuxRadio> & { Default: string; change: never };

/**
 * Allows to select/check only one option of a given group of related elements. Generally a radio button is used in a radio button group.
 *
 * They behave behave similar to push buttons but they don't submit the form.
 */
const meta = {
  title: "Form/Radio Button",
  tags: ["autodocs"],
  argTypes: {
    name: {
      type: "string",
      description:
        "Name of the radio button, submitted as key/pair with the `value`",
    },
    checked: {
      type: "boolean",
      description: "Whether or not this radio button is checked by default",
    },
    value: {
      type: "string",
      description: "Value associated to the radio button's `name`",
    },
    disabled: {
      type: "boolean",
      description: "Prevents user interaction",
    },
    change: {
      table: { category: "Events" },
      description:
        "fires when the `value` of the control has been modified by the user",
      type: { name: "function" },
    },
    Default: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Any content/label for the radio button, can be text or HTML",
    },
  },
  render({ Default, checked, name, value, disabled }) {
    return html`<apux-radio
      name=${ifDefined(name)}
      .value=${value}
      ?checked=${checked}
      ?disabled=${disabled}
      >${unsafeHTML(Default)}</apux-radio
    >`;
  },
  parameters: {
    actions: {
      handles: ["change"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const BasicUnchecked: Story = {
  args: {
    Default: "Atlantic",
    checked: false,
  },
};

export const BasicChecked: Story = {
  args: {
    Default: "Pacific",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    Default: "Pacific",
    checked: true,
    disabled: true,
  },
};

export const NoLabel: Story = {
  render: (args) =>
    html`${meta.render(args)}${meta.render({
      ...args,
      checked: false,
    })}${meta.render({ ...args, checked: true })}`,
  args: { checked: true },
};

export const MultipleWithSameName: Story = {
  render(args) {
    return html`<div>${meta.render(args)}</div>
      <div>
        ${meta.render({
          ...args,
          Default: "Saturn",
          value: "saturn",
          checked: false,
        })}
      </div>
      <div>
        ${meta.render({
          ...args,
          Default: "Jupiter",
          value: "jupiter",
          checked: false,
        })}
      </div>
      <h3>Other form:</h3>
      <p>Context, even if the same name is used, the elements don't interact</p>
      <form>
        <div>
          ${meta.render({
            ...args,
            Default: "Saturn",
            value: "saturn",
            checked: false,
          })}
        </div>
        <div>
          ${meta.render({
            ...args,
            Default: "Jupiter",
            value: "jupiter",
            checked: false,
          })}
        </div>
      </form>`;
  },
  args: {
    Default: "Mars",
    value: "mars",
    name: "planets",
    checked: true,
  },
};

const events = actions("onSubmit");

/**
 * Submit by **Enter**.
 */
export const FormIntegration: Story = {
  render(args) {
    const submit = function (this: HTMLFormElement, event: SubmitEvent) {
      event.preventDefault();
      const data = new FormData(this);
      const params = new URLSearchParams(
        data as unknown as undefined,
      ).toString();
      events.onSubmit({ event, params });
    };
    return html`<form @submit=${submit}>
      ${meta.render(args)}
      <div>
        ${meta.render({
          ...args,
          Default: "Arctic",
          value: "arctic",
          checked: false,
        })}
      </div>
    </form>`;
  },
  args: {
    name: "ocean",
    Default: "Atlantic",
    value: "atlantic",
  },
};

export const Events: Story = {
  render(args) {
    return html` <div>${meta.render(args)}</div>
      <div>
        ${meta.render({
          ...args,
          Default: "Jupiter",
          value: "jupiter",
          checked: false,
        })}
      </div>`;
  },
  args: {
    Default: "Uranus",
    value: "uranus",
    name: "planet",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [radio1, radio2] = canvas.getAllByRole<ApuxRadio>("radio");
    userEvent.click(radio1.internals.radio);
    userEvent.click(radio2.internals.radio);
  },
};

/**
 * - **Tab** navigates to the next form element or radios with different name.
 * - **Up & Left arrows** focus and check the previous element of the group.
 * - **Down & Right arrows** focus and check the next element of the group.
 */
export const KeyboardEvents: Story = {
  render(args) {
    const clickListener = function (this: HTMLElement) {
      const [radio1, radio2] = this.parentElement!.querySelectorAll<ApuxRadio>(
        `apux-radio[name="dogs"]`,
      );
      radio1.before(radio2);
    };
    return html`<apux-button icon="shuffle" @click="${clickListener}"
        >Swap radio buttons</apux-button
      ><br /><br />
      <span>Dogs group</span><br />
      <apux-radio-group orientation="vertical">
        ${meta.render(args)}
        <apux-radio name="dogs" value="Greyhound">Greyhound</apux-radio>
        <apux-radio name="dogs" value="Corgi">Corgi</apux-radio>
      </apux-radio-group>
      <span>Snakes form</span>
      <form>
        <div>
          <apux-radio name="snakes" value="Cobra">Cobra</apux-radio>
        </div>
        <div>
          <apux-radio name="snakes" value="Ball Python">Ball Python</apux-radio>
        </div>
        <div>
          <apux-radio name="snakes" value="Corn Snake" disabled
            >Corn Snake</apux-radio
          >
        </div>
      </form>
      <span>Cats group</span>
      <apux-radio-group orientation="vertical">
        <apux-radio name="cats" value="Bengal">Bengal</apux-radio>
        <apux-radio name="cats" value="Persian" disabled>Persian</apux-radio>
        <apux-radio name="cats" value="Bombay">Bombay</apux-radio>
      </apux-radio-group>`;
  },
  args: {
    Default: "Bulldog",
    value: "Bulldog",
    name: "dogs",
    checked: false,
    disabled: true,
  },
};

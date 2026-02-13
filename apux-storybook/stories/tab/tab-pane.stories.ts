import { StoryObj, Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { iconNames } from "../../../apux/src/types.js";
import { clearItem } from "../../utils/args.js";

type Args = ApuxTabPane & { Default: string; change: never };

/**
 * A tab pane is a container for the resources associated with a tab.
 * One tab pane is displayed at a time based on the selected tab.
 */
const meta = {
  title: "General/Tab/Tab Pane",
  tags: ["autodocs"],
  argTypes: {
    Default: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Any content/label for the tab pane, can be text or HTML associated to a tab",
    },
    text: {
      type: "string",
      description: "Label for the associated tab",
    },
    closeable: {
      name: "closeable",
      type: "boolean",
      description: "Shows the close button on associated tab",
    },
    closed: {
      name: "closed",
      type: "boolean",
      description:
        "show/hide tab-pane and associated tab(only if it has closeable prop/attr set to true)",
    },
    selected: {
      type: "boolean",
      description: "Whether the tab-pane is currently selected",
    },
    disabled: {
      name: "disabled",
      type: "boolean",
      description: "Disables associated tab to prevent user interaction",
    },
    draggable: {
      type: "boolean",
      description:
        "Enable or disable drag-and-drop functionality on associated tab",
    },
    icon: {
      name: "icon",
      control: { type: "select" },
      options: [clearItem, ...iconNames],
      type: {
        name: "enum",
        value: [...iconNames],
      },
      description: "An icon to be displayed as part of the tab",
    },
    change: {
      table: { category: "Events" },
      description: "Triggered when a user selects a new tab by clicking on it.",
      type: { name: "function" },
    },
  },
  render: ({
    text,
    icon,
    selected,
    closeable,
    closed,
    disabled,
    draggable,
    Default,
  }) => {
    return html` <apux-tab-panes>
      <apux-tab-pane
        text=${text}
        icon=${ifDefined(icon)}
        ?selected=${selected}
        ?closeable=${closeable}
        ?closed=${closed}
        ?disabled=${disabled}
        ?draggable=${draggable}
      >
        ${unsafeHTML(Default)}
      </apux-tab-pane>
    </apux-tab-panes>`;
  },
  parameters: {
    actions: {
      handles: ["close", "change"],
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export default meta;

const story = `Once upon a time in the mystical realm of Mount Olympus, where Greek gods and goddesses resided,
there lived two brothers who couldn't be more different from each other. Zeus, the mighty ruler of the gods,
was known for his thunderous voice and his love for mischief. On the other hand, Hades, the ruler of the underworld,
was a rather gloomy and introverted deity who preferred the company of shadows.`;

export const Default: Story = {
  args: {
    Default: `
    One sunny day, as Oliver and Penelope were frolicking near the farm's pond, they noticed a tiny bird with a broken wing.
    The poor bird looked sad and helpless, unable to fly. The piggies' hearts filled with empathy,
    and they decided to help their new feathered friend.
    <br><br>
    Oliver and Penelope gently carried the little bird to their cozy pigsty. They created a warm nest made of straw and lined it with soft feathers.
    Together, they fetched water and tiny crumbs of bread to nourish their avian companion. 
    Days turned into weeks, and under the piggies' loving care, the bird's wing slowly healed.
    <br><br>
    As soon as the bird regained its strength, it fluttered around the pigsty, singing cheerful melodies that filled the air.
    Oliver and Penelope were overjoyed to witness their feathered friend's recovery. They named the bird Charlie,
    and the trio formed an inseparable bond.`,
    text: "Oliver & Penelope",
  },
};

export const WithIcon: Story = {
  args: {
    Default: `
    <h4>Write us your favorite mythological story </h4>
    <form>
      <apux-field label="Name">
        <apux-input name="name" required value="Patrick" role="input"></apux-input>
      </apux-field>
      <apux-field label="Greek God" description="Select your favorite greek god">
        <apux-select name="god" required id="greek" role="listbox">
          <apux-option value="zeus" selected="" role="option">Zeus</apux-option>
          <apux-option value="hades" role="option">Hades</apux-option>
          <apux-option value="poseidon" role="option">Poseidon</apux-option>
        </apux-select>
      </apux-field>
      <apux-field label="About" description="Write what you know about your favorite greek god">
        <apux-textarea name="details" rows="6" value="Zeus is the sky and thunder god in ancient Greek religion, who rules as king of the gods on Mount Olympus." required role="textbox">
        </apux-textarea>
      </apux-field>
      <apux-button variant="primary" role="button">Submit</apux-button>
    </form>`,
    text: "Mystic Gods",
    icon: "user-in-circle",
  },
};

export const RichContent: Story = {
  args: {
    Default: `
    <p>Please send us details about the incident. Our complaint center will analyze your complaint and take appropriate measures
    to resolve the issue at the earliest.</p>
    <form>
      <apux-field label="Date of Complaint">
        <input type="date" id="complaint" name="complaint">
      </apux-field>
      <apux-field label="Name">
        <apux-input name="first-name" required placeholder="First Name" value="Peter"></apux-input>
        <apux-input name="last-name" required placeholder="Last Name"  value="Patrick"></apux-input>
      </apux-field>
      <apux-field label="Email">
        <apux-input name="email" required placeholder="someone@xyz.com" value="patrick@xyz.com"></apux-input>
      </apux-field>
      <apux-field label="Address">
        <apux-input name="address_line1" placeholder="Street Address"></apux-input>
      </apux-field>
      <apux-field>
        <apux-input name="address_line2" placeholder="Street Address Line2"></apux-input>
      </apux-field>
      <apux-field>
        <apux-input name="city" placeholder="City"></apux-input>
        <apux-input name="region" placeholder="Region"></apux-input>
      </apux-field>
      <apux-field>
        <apux-input name="zip-code" placeholder="Postal/Zip code"></apux-input>
        <apux-select name="Country" placeholder="Select country" >
          <apux-option value="in" role="option">India</apux-option>
          <apux-option value="pl" role="option">Poland</apux-option>
          <apux-option value="es" role="option">Spain</apux-option>
        </apux-select>
      </apux-field>
      <apux-field label="Incident Location">
        <apux-input name="location" placeholder="Incident location"></apux-input>
      </apux-field>
      <apux-field label="Complaint details">
        <apux-textarea name="complaint-details" rows="6" required role="textbox"></apux-textarea>
      </apux-field>
      <apux-button variant="primary" role="button">Submit Complaint</apux-button>
    </form>`,
    text: "Complaint form",
    icon: "object",
  },
};

export const CloseablePanel: Story = {
  render() {
    return html`<apux-tab-panes>
      <apux-tab-pane closeable text="Favorite Pet">
        <form @submit=${(e: Event) => e.preventDefault()}>
          <apux-field label="Name">
            <apux-input
              name="name"
              required
              value="Husky"
              role="input"
            ></apux-input>
          </apux-field>
          <apux-field label="Email">
            <apux-input
              name="email"
              placeholder="someone@xyz.com"
              value="husky@xyz.com"
            ></apux-input>
          </apux-field>
          <apux-field label="Color">
            <input type="color" id="color" name="color" />
          </apux-field>
          <apux-field label="Favorite Pet">
            <apux-select
              name="pet"
              placeholder="Select your favorite pet"
              required
            >
              <apux-option value="dog" role="option">Dog</apux-option>
              <apux-option value="cat" role="option">Cat</apux-option>
              <apux-option value="iguana" role="option">Iguana</apux-option>
            </apux-select>
          </apux-field>
          <apux-button variant="primary" role="button">Submit</apux-button>
        </form>
      </apux-tab-pane>
      <apux-tab-pane
        closeable
        @close=${(e: Event) => e.preventDefault()}
        text="Default Prevented"
      >
        ${story}
      </apux-tab-pane>
    </apux-tab-panes>`;
  },
};

export const DisabledPane: Story = {
  render() {
    return html`<apux-tab-panes>
      <apux-tab-pane text="Favorite Pet"> ${story} </apux-tab-pane>
      <apux-tab-pane text="Disabled Tab" disabled>
        This is a disabled tab-pane which prevents user interactions with its
        associated tabs
      </apux-tab-pane>
    </apux-tab-panes>`;
  },
};

export const SelectedPane: Story = {
  render() {
    return html`<apux-tab-panes>
      <apux-tab-pane text="Favorite Pet"> ${story} </apux-tab-pane>
      <apux-tab-pane text="Selected Tab" selected>
        This is a disabled tab-pane which prevents user interactions with its
        associated tabs
      </apux-tab-pane>
    </apux-tab-panes>`;
  },
};

export const ShowHidePane: Story = {
  args: {
    Default:
      "Try playing with the closed prop/attr in controls and see the magic",
    text: "I can be closed",
    icon: "user-in-circle",
    closeable: true,
  },
};

/**
 * Setting draggable attribute to true, allows the user to drag the associated tab.
 * Logic for drag and drop is not handled by the component.
 */

export const DraggableTab: Story = {
  args: {
    Default:
      "Setting draggable prop/attr to true allows the user to drag the associated tab",
    text: "I can be dragged",
    icon: "user-in-circle",
    draggable: true,
  },
};

import { displayList, paneVariants } from "@abb-hmi/apux/types";
import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { responsive } from "../../utils/decorators.js";
import { toolbarElementsExample } from "../toolbar/toolbar.stories.js";

type Args = Omit<ApuxTabPanes, "Default" | "suffix" | "change" | "add"> & {
  Default: string;
  suffix: string;
  change: never;
  add: never;
};
/**
 * The tab-panes represents a collection of panes which are associated to tabs.
 * Panes are shown or hidden based on selected tab.
 */
const meta = {
  title: "General/Tab/Tab Panes",
  tags: ["autodocs"],
  argTypes: {
    Default: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Content for the tab panes, can be text or HTML, usually a list of tab panes",
    },
    suffix: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Content for the suffix, can be text or HTML, usually a set of buttons or other interactive elements",
    },
    addButton: {
      name: "add-button",
      type: "boolean",
      description: "**DEPRECATED** Shows/Hides the add button",
    },
    variant: {
      description: `Stylistic variation`,
      type: {
        name: "enum",
        value: [...paneVariants],
      },
    },
    change: {
      table: { category: "Events" },
      description: "Triggered when a user selects a new tab by clicking on it.",
      type: { name: "function" },
    },
    displayList: {
      type: {
        name: "enum",
        value: [...displayList],
      },
      name: "display-list",
      description: "show/hide tablist based on selected type",
    },
    add: {
      table: { category: "Events" },
      description: "**DEPRECATED** Fires when the user clicks add button",
      type: { name: "function" },
    },
  },
  parameters: {
    actions: {
      handles: ["add", "change"],
    },
  },
  render: ({ Default, suffix, addButton, variant, displayList }) => {
    return html` <apux-tab-panes
      ?add-button=${addButton}
      variant=${variant}
      display-list=${displayList}
    >
      ${unsafeHTML(Default)}
      <div slot="suffix">${unsafeHTML(suffix)}</div>
    </apux-tab-panes>`;
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export default meta;

const story = `Once upon a time in the mystical realm of Mount Olympus, where Greek gods and goddesses resided,
there lived two brothers who couldn't be more different from each other. Zeus, the mighty ruler of the gods,
was known for his thunderous voice and his love for mischief. On the other hand, Hades, the ruler of the underworld,
was a rather gloomy and introverted deity who preferred the company of shadows.`;

const form = `<form>
<apux-field label="Name">
  <apux-input name="name" required value="Patrick" role="input"></apux-input>
</apux-field>
<apux-field label="Age">
  <apux-input type="number" name="age" required value="25" role="input"></apux-input>
</apux-field>
<apux-field label="Power">
  <apux-select name="power" required id="power" role="listbox">
    <apux-option value="Thunder" selected="" role="option">Thunder</apux-option>
    <apux-option value="Wisdom" role="option">Wisdom</apux-option>
    <apux-option value="Healing" role="option">Healing</apux-option>
  </apux-select>
</apux-field>
<apux-field label="Email">
  <apux-input name="email" required placeholder="someone@xyz.com" value="patrick@xyz.com"></apux-input>
</apux-field>
<apux-field label="Avatar">
  <input type="file" id="avatar" name="avatar">
</apux-field>
<apux-button variant="primary" role="button">Become a god</apux-button>
</form>`;

export const Default: Story = {
  args: {
    Default: `
    <apux-tab-pane text="Zeus & Hades" icon="charging">
      ${story}
      <p>Zeus, with his flowing golden locks and a gleaming crown of lightning bolts, loved to flaunt his power and charm the goddesses.
      He would often throw lavish parties on Olympus, with music and dancing that echoed throughout the heavens.His booming laughter could be heard from miles away,
      and his thunderous footsteps made the earth tremble.</p>
      
      <p>Hades, with his dark, disheveled hair and a perpetual scowl, preferred the solitude of the underworld.
      He spent his days overseeing the souls of the departed and managing the affairs of the dead. The mere mention of his name sent shivers down the spines of mortals and even gods alike. 
      Hades rarely left his gloomy abode, except when his duties required him to attend important divine gatherings.</p>
    </apux-tab-pane>
    <apux-tab-pane text="God's Registration" icon="wheel">
    ${form}
      </apux-tab-pane>`,
  },
};

/**
 * **DEPRECATED** - Use the [Suffix](#suffix) slot instead for adding extra content.
 */
export const AddPaneEvent: Story = {
  name: "Event (Add Pane)",
  args: {
    Default: `
    <apux-tab-pane text="Lilly">
    <p>Once upon a time, in a small village nestled at the foot of a majestic mountain, lived a young girl named Lily.
    Lily had a heart full of curiosity and an insatiable thirst for adventure. Every day, she would wander through the lush green fields surrounding the village,
    imagining herself exploring far-off lands and encountering magical creatures.</p>
    <p>One sunny morning, as Lily was gathering wildflowers near a babbling brook, she spotted a peculiar map peeking out from beneath a mossy stone.
    Excitement danced in her eyes as she carefully unfolded the aged parchment. The map depicted a hidden treasure buried deep within the mysterious Whispering Woods,
    a dense forest rumored to be enchanted.</p>
    <p>Without hesitation, Lily decided to embark on a grand quest to find the treasure. Equipped with her trusty backpack and a heart full of courage,
    she followed the directions on the map, winding her way through towering trees and meandering streams. As she ventured deeper into the forest,
    whispers carried by the wind echoed around her, guiding her path.</p>
    </apux-tab-pane>`,
    addButton: true,
  },
};

export const PaneChangeEvent: Story = {
  name: "Event (Pane Change)",
  args: {
    Default: `
    <apux-tab-pane text="Zeus & Hades" icon="charging">
      ${story}
      <p>Zeus, with his flowing golden locks and a gleaming crown of lightning bolts, loved to flaunt his power and charm the goddesses.
      He would often throw lavish parties on Olympus, with music and dancing that echoed throughout the heavens.His booming laughter could be heard from miles away,
      and his thunderous footsteps made the earth tremble.</p>
      
      <p>Hades, with his dark, disheveled hair and a perpetual scowl, preferred the solitude of the underworld.
      He spent his days overseeing the souls of the departed and managing the affairs of the dead. The mere mention of his name sent shivers down the spines of mortals and even gods alike. 
      Hades rarely left his gloomy abode, except when his duties required him to attend important divine gatherings.</p>
    </apux-tab-pane>
    <apux-tab-pane text="God's Registration" icon="wheel">
    ${form}
      </apux-tab-pane>`,
  },
};

export const Responsive: Story = {
  decorators: [responsive({ width: 800 })],
  args: {
    Default: `<apux-tab-pane
        icon="light-bulb"
        text="Athena(Wisdom, Reason & War)"
      >
        <h3>Goddess of reason, wisdom, and war.</h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane icon="star" text="Demeter">
        <h3>Agricultural goddess, was mother to Persephone.</h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane text="Artemis">
        <h3>Fleet-footed goddess of the hunt.</h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane text="Hermes">
        <h3>
          He was a pastoral figure, responsible for protecting livestock, and
          was also associated with fertility, music, luck, and deception.
        </h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane icon="pump" text="Poseidon">
        <h3>
          Best known as the Greek sea god, but he was also the god of horses and
          of earthquakes.
        </h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane text="Apollo">
        <h3>The twin brother of Artemis.</h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane icon="globe" text="Hera(Goddess of olympus & wife of zeus)">
        <h3>The queen goddess of Olympus.</h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane icon="cut" text="Ares">
        <h3>God of blood-lust.</h3>
        ${story}
      </apux-tab-pane>`,
    addButton: true,
  },
};

export const Primary: Story = {
  name: "Variant: Primary",
  args: {
    Default: `
    <apux-tab-pane icon="light-bulb" text="Athena(Wisdom, Reason & War)">
      <h3>Goddess of reason, wisdom, and war.</h3>
      ${story}
    </apux-tab-pane>`,
    variant: "primary",
  },
};

export const Secondary: Story = {
  name: "Variant: Secondary",
  args: {
    Default: `
    <apux-tab-pane icon="pump" text="Poseidon">
      <h3>
        Best known as the Greek sea god, but he was also the god of horses and
          of earthquakes.
      </h3>
      ${story}
    </apux-tab-pane>
    <apux-tab-pane text="Apollo">
      <h3>The twin brother of Artemis.</h3>
      ${story}
    </apux-tab-pane>`,
    variant: "secondary",
  },
};

export const SecondaryInverted: Story = {
  name: "Variant: Secondary-Inverted",
  args: {
    Default: `
    <apux-tab-pane text="Artemis">
      <h3>Fleet-footed goddess of the hunt.</h3>
      ${story}
    </apux-tab-pane>
    <apux-tab-pane text="Hermes">
      <h3>
        He was a pastoral figure, responsible for protecting livestock, and
        was also associated with fertility, music, luck, and deception.
      </h3>
      ${story}
    </apux-tab-pane>`,
    variant: "secondary-inverted",
  },
};

export const Tooltip: Story = {
  args: {
    Default: `<apux-tab-pane
        icon="light-bulb"
        text="This is a tab pane that describes goddess athena who is a goddess of reason , wisdom and war"
      >
        <h3>Goddess of reason, wisdom, and war.</h3>
        ${story}
      </apux-tab-pane>
      <apux-tab-pane icon="star" text="Demeter">
        <h3>Agricultural goddess, was mother to Persephone.</h3>
        ${story}
      </apux-tab-pane>
      `,
  },
};

/**
 * An attr/prop display-list with three values.
 * - **always(default):** always show the tablist.
 * - **multiple:** hide tablist when there is only one visible pane, else show tablist.
 * - **never:** hide tablist.
 */
export const DisplayListMultiple: Story = {
  name: "Display List (Multiple)",
  args: {
    Default: `
    <apux-tab-pane text="Zeus & Hades" icon="charging">
      ${story}
      <p>Zeus, with his flowing golden locks and a gleaming crown of lightning bolts, loved to flaunt his power and charm the goddesses.
      He would often throw lavish parties on Olympus, with music and dancing that echoed throughout the heavens.His booming laughter could be heard from miles away,
      and his thunderous footsteps made the earth tremble...</p>
      
      <p>Hades, with his dark, disheveled hair and a perpetual scowl, preferred the solitude of the underworld.
      He spent his days overseeing the souls of the departed and managing the affairs of the dead. The mere mention of his name sent shivers down the spines of mortals and even gods alike. 
      Hades rarely left his gloomy abode, except when his duties required him to attend important divine gatherings.</p>
    </apux-tab-pane>`,
    displayList: "multiple",
  },
};

/**
 * It is an additional behavior of tab panes which works only for primary variants.
 *
 * It changes the border color of the active tab when, focus moved to the different tab panes.
 *
 * In the situation of different variants or only one tab panes, it will not work.
 */
export const ActiveAndFocused: Story = {
  name: "Active against focused",
  render() {
    return html`<h2>Norse Gods</h2>
      <apux-tab-panes variant="primary">
        <apux-tab-pane text="Loki" icon="view">
          <p>
            Loki is a cunning trickster who has the ability to change his shape
            and sex. Loki is represented as the companion of the great gods Odin
            and Thor.
          </p>
        </apux-tab-pane>

        <apux-tab-pane text="Thor" icon="voltage">
          <p>
            In Norse mythology, he is a hammer-wielding god associated with
            lightning, thunder, storms, sacred groves and trees, strength, the
            protection of humankind, hallowing, and fertility.
          </p>
          <apux-button>Click me</apux-button>
        </apux-tab-pane>
      </apux-tab-panes>

      <h2>Greek gods</h2>
      <apux-tab-panes variant="primary">
        <apux-tab-pane text="Ares" icon="bearing">
          <p>
            God of courage, war, bloodshed, and violence. The son of Zeus and
            Hera, he was depicted as a beardless youth, either nude with a
            helmet and spear or sword, or as an armed warrior. Homer portrays
            him as moody and unreliable, and as being the most unpopular god on
            earth and Olympus.
          </p>
        </apux-tab-pane>

        <apux-tab-pane text="Poseidon" icon="cloud">
          <p>
            od of the sea, rivers, floods, droughts, and earthquakes. He is a
            son of Cronus and Rhea, and the brother of Zeus and Hades. He rules
            one of the three realms of the universe, as king of the sea and the
            waters. In art he is depicted as a mature man of sturdy build, often
            with a luxuriant beard, and holding a trident.
          </p>
        </apux-tab-pane>
      </apux-tab-panes>`;
  },
};

/**
 * **This functionality applies only for the primary variant of tab panes**.
 *
 * The suffix is a slot that can be used to add extra content to the tab panes.
 * This extra content will appear on the right side of the tab list.
 * It is responsive. Elements that won't fit will jump to the new line.
 *
 * **It is important to use it wisely**, as adding too many elements may clutter the interface and confuse users.
 * The same applies to adding large elements that take up too much space.
 */
export const Suffix: Story = {
  args: {
    suffix: `<apux-toolbar>${toolbarElementsExample}</apux-toolbar>`,
    Default: `<apux-tab-pane text="Zeus & Hades" icon="charging">
      ${story}
      <p>Zeus, with his flowing golden locks and a gleaming crown of lightning bolts, loved to flaunt his power and charm the goddesses.
      He would often throw lavish parties on Olympus, with music and dancing that echoed throughout the heavens.His booming laughter could be heard from miles away,
      and his thunderous footsteps made the earth tremble.</p>
      
      <p>Hades, with his dark, disheveled hair and a perpetual scowl, preferred the solitude of the underworld.
      He spent his days overseeing the souls of the departed and managing the affairs of the dead. The mere mention of his name sent shivers down the spines of mortals and even gods alike. 
      Hades rarely left his gloomy abode, except when his duties required him to attend important divine gatherings.</p>
    </apux-tab-pane>
    <apux-tab-pane text="God's Registration" icon="wheel">
    ${form}
    </apux-tab-pane>`,
    variant: "primary",
  },
};

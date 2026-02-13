import { componentSizes } from "@abb-hmi/apux/types";
import { Meta, StoryFn, StoryObj } from "@storybook/web-components";
import { html, TemplateResult } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { ref, createRef, RefOrCallback } from "lit-html/directives/ref.js";
import { responsive } from "../../utils/decorators";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

type Args = ApuxTreeView & {
  Default: string;
  searchEvent: never;
  loadMoreEvent: never;
  suffix?: string;
};

/**
 * A tree view presents a hierarchical list.
 * Any item in the hierarchy may have child items,
 * and items that have children may be expanded or collapsed to show
 * or hide the children.
 *
 * - **Tab** navigate & set focus to the next item.
 * - **Arrow Right key** Expands the active treeitem if it has children.
 * - **Arrow Right key** Collapse the active treeitem if it has children.
 * - **Arrow Up key** Moves focus to previous element or parent.
 * - **Arrow Down key** Moves focus to next element or child.
 * - **Space** Select/Unselect active tree item.
 */
const meta = {
  title: "General/Tree view/Tree view",
  tags: ["autodocs"],
  argTypes: {
    selection: {
      type: {
        name: "enum",
        value: ["row", "checkbox"],
      },
      description:
        "Allows selection of items based on type, either row click or checkbox click",
    },
    multiple: {
      type: "boolean",
      description: "Allows users to select multiple tree items",
      if: { arg: "selection", eq: "row" },
    },
    search: {
      type: "boolean",
      description: "Enable the search feature to filter out tree items",
    },
    searchPlaceHolder: {
      type: "string",
      name: "search-placeholder",
      description:
        "Displayed text in the control when there is no value introduced",
      if: { arg: "search" },
    },
    searchValue: {
      type: "string",
      name: "search-value",
      description: "Default value for the search bar",
      if: { arg: "search" },
    },
    searchMin: {
      type: "number",
      name: "search-min",
      description: "Minimum amount of characters to trigger the search",
      if: { arg: "search" },
    },
    loadMoreOn: {
      type: "string",
      name: "load-more-on",
      description:
        "Request to trigger the `load-event` when the user scrolls to the end of the control minus a padding (eg: 200px or 10%)",
    },
    size: {
      description: `Vertical size of the tree items`,
      type: {
        name: "enum",
        value: [...componentSizes],
      },
    },
    list: {
      description:
        "Limits the tree view to display all elements as if they were first level. Nesting is disabled visually.",
      type: { name: "boolean" },
    },
    searchEvent: {
      table: { category: "Events" },
      name: "search",
      description: [
        "fires when there is a modification to the search properties, ",
        "cancelling this event prevents the default search behavior",
      ].join(""),
      type: { name: "function" },
    },
    loadMoreEvent: {
      table: { category: "Events" },
      name: "load-more",
      description:
        "fires when the user scrolls to the end of the control minus a padding (eg: 200px or 10%)",
      type: { name: "function" },
    },
    suffix: {
      type: "string",
      table: { category: "Slots" },
      description:
        "Content to be shown next to the search input, can be text or HTML, usually a set of buttons or other interactive elements",
    },
  },
  parameters: {
    actions: {
      handles: ["click apux-tree-view-item", "search"],
    },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

const template =
  (
    content: TemplateResult,
    config?: { reference?: RefOrCallback; style?: string }
  ): StoryFn<Args> =>
  ({
    selection,
    multiple,
    search,
    searchValue,
    searchPlaceHolder,
    searchMin,
    loadMoreOn,
    size,
    list,
    suffix,
  }) => {
    return html`<apux-tree-view
      style=${ifDefined(config?.style)}
      ref=${ref(config?.reference ?? createRef())}
      .selection=${selection}
      ?multiple=${multiple}
      load-more-on=${ifDefined(loadMoreOn)}
      ?search=${search}
      search-value=${ifDefined(searchValue)}
      search-placeholder=${ifDefined(searchPlaceHolder)}
      search-min=${ifDefined(searchMin)}
      .size=${size}
      list=${ifDefined(list)}
    >
      ${content}
      ${suffix ? html`<div slot="suffix">${unsafeHTML(suffix)}</div>` : ""}
    </apux-tree-view>`;
  };

export const Default: Story = {
  render: template(html`<apux-tree-view-item open text="Fruits">
      <apux-tree-view-item open text="Melons">
        <apux-tree-view-item text="Watermelons"></apux-tree-view-item>
        <apux-tree-view-item text="Cantaloupe" disabled></apux-tree-view-item>
        <apux-tree-view-item text="Honeydew"></apux-tree-view-item>
        <apux-tree-view-item text="Winter Melon"></apux-tree-view-item>
      </apux-tree-view-item>
      <apux-tree-view-item text="Citrus">
        <apux-tree-view-item text="Oranges">
          <apux-tree-view-item text="Mandarins">
            <apux-tree-view-item text="Tangerines"></apux-tree-view-item>
            <apux-tree-view-item text="Swatow"></apux-tree-view-item>
          </apux-tree-view-item>
        </apux-tree-view-item>
      </apux-tree-view-item>
      <apux-tree-view-item open text="Berries">
        <apux-tree-view-item text="Raspberries" disabled></apux-tree-view-item>
        <apux-tree-view-item text="Blueberries"></apux-tree-view-item>
        <apux-tree-view-item text="Strawberries"></apux-tree-view-item>
      </apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item open text="Vegetables">
      <apux-tree-view-item text="Leafy green">
        <apux-tree-view-item text="Spinach"></apux-tree-view-item>
      </apux-tree-view-item>
      <apux-tree-view-item text="Cruciferous">
        <apux-tree-view-item text="Cabbage"></apux-tree-view-item>
      </apux-tree-view-item>
      <apux-tree-view-item text="Root">
        <apux-tree-view-item text="Potato"></apux-tree-view-item>
        <apux-tree-view-item text="Carrot"></apux-tree-view-item>
      </apux-tree-view-item>
    </apux-tree-view-item>`),
};

export const MultiSelection: Story = {
  render: template(html`<apux-tree-view-item open text="Continents">
    <apux-tree-view-item open text="Europe">
      <apux-tree-view-item text="Poland" selected></apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item text="South America" selected>
      <apux-tree-view-item text="Argentina"></apux-tree-view-item>
    </apux-tree-view-item>
  </apux-tree-view-item>`),
  name: "Selection (multiple)",
  args: {
    selection: "row",
    multiple: true,
  },
};

export const WithCheckbox: Story = {
  render: template(html`<apux-tree-view-item open text="Continents">
    <apux-tree-view-item open text="Europe">
      <apux-tree-view-item text="Croatia" disabled></apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item text="North America">
      <apux-tree-view-item text="United States"></apux-tree-view-item>
    </apux-tree-view-item>
  </apux-tree-view-item>`),
  name: "Selection (with checkboxes)",
  args: {
    selection: "checkbox",
  },
};

export const Small: Story = {
  render: template(html`
    <apux-tree-view-item open text="Apple">
      <apux-tree-view-item text="Green Apple"></apux-tree-view-item>
      <apux-tree-view-item text="Cortland Apple"></apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item text="Beetroot"> </apux-tree-view-item>
    <apux-tree-view-item text="Carrot"></apux-tree-view-item>
  `),
  args: {
    size: "small",
  },
};

const languageTree = html`<apux-tree-view-item icon="battery-charging" open text="Indo-European">
<apux-tree-view-item open text="Italic">
  <apux-tree-view-item text="Romance">
    <apux-tree-view-item text="Italian"></apux-tree-view-item>
    <apux-tree-view-item text="Gallo-Romance">
      <apux-tree-view-item text="French"></apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item text="Iberian">
      <apux-tree-view-item text="Portuguese"></apux-tree-view-item>
      <apux-tree-view-item text="Spanish"></apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item text="Romanian"></apux-tree-view-item>
  </apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Celtic">
  <apux-tree-view-item text="Irish"></apux-tree-view-item>
  <apux-tree-view-item text="Gaelic"></apux-tree-view-item>
  <apux-tree-view-item text="Welsh"></apux-tree-view-item>
  </apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item open text="Germanic">
  <apux-tree-view-item icon="check-mark-circle-1" text="North Germanic">
    <apux-tree-view-item text="East Scandinavian">
      <apux-tree-view-item text="Danish"></apux-tree-view-item>
      <apux-tree-view-item text="Swedish"></apux-tree-view-item>
    </apux-tree-view-item>
    <apux-tree-view-item text="West Scandinavian">
      <apux-tree-view-item text="Norwegian">
        <apux-tree-view-item icon="chat-1" text="Bokmål"></apux-tree-view-item>
        <apux-tree-view-item icon="chat-2" text="Nynorsk"></apux-tree-view-item>
      </apux-tree-view-item>
    </apux-tree-view-item>
  </apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item open text="Slavic">
  <apux-tree-view-item text="East Slavic">
    <apux-tree-view-item text="Russian"></apux-tree-view-item>
    <apux-tree-view-item text="Ukrainian"></apux-tree-view-item>
  </apux-tree-view-item>
  <apux-tree-view-item text="West Slavic">
    <apux-tree-view-item text="Czech"></apux-tree-view-item>
    <apux-tree-view-item text="Polish"></apux-tree-view-item>
  </apux-tree-view-item>
  <apux-tree-view-item text="South Slavic">
    <apux-tree-view-item text="Slovene"></apux-tree-view-item>
    <apux-tree-view-item text="Serbian"></apux-tree-view-item>
  </apux-tree-view-item>
</apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item icon="bookmark" open text="Uto-Aztecan">
<apux-tree-view-item text="Northern">
  <apux-tree-view-item text="Comanche"></apux-tree-view-item>
  <apux-tree-view-item text="Hopi"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Southern">
  <apux-tree-view-item text="Cahita">
    <apux-tree-view-item text="Mayo"></apux-tree-view-item>
    <apux-tree-view-item text="Yaqui"></apux-tree-view-item>
  </apux-tree-view-item>
  <apux-tree-view-item text="Aztecan">
    <apux-tree-view-item text="Pipil"></apux-tree-view-item>
    <apux-tree-view-item icon="charging" text="Nahuatl"></apux-tree-view-item>
  </apux-tree-view-item>
</apux-tree-view-item>
</apux-tree-view-item>
</apux-tree-view>`;

/**
 * Search items of the tree by introducing text,
 * the default search implementation looks for the inputted text
 * in the content of the item, only when the `text` attribute is used;
 * it doesn't do anything when the item is slotted and `text` is not set.
 * For that case, it is possible to prevent the default behavior by cancelling
 * the event `search` and replace it with a custom implementation
 * (possibly in the server).
 *
 * The search is case insensitive, and the search bar is debounced.
 */
export const Search: Story = {
  render: template(languageTree),
  args: {
    search: true,
    searchValue: "west",
    searchPlaceHolder: "Filter languages",
  },
};

const languageSpeakers: { name: string; quantity: number }[] = [
  { name: "Italian", quantity: 65 },
  { name: "French", quantity: 80 },
  { name: "Portuguese", quantity: 230 },
  { name: "Spanish", quantity: 488 },
  { name: "Romanian", quantity: 24 },
  { name: "Irish", quantity: 0.17 },
  { name: "Gaelic", quantity: 0 },
  { name: "Welsh", quantity: 0.5 },
  { name: "Danish", quantity: 6 },
  { name: "Swedish", quantity: 10 },
  { name: "Norwegian", quantity: 5 },
  { name: "Russian", quantity: 150 },
  { name: "Ukrainian", quantity: 27 },
  { name: "Czech", quantity: 10 },
  { name: "Polish", quantity: 40 },
  { name: "Slovene", quantity: 2 },
  { name: "Serbian", quantity: 12 },
  { name: "Comanche", quantity: 0 },
  { name: "Hopi", quantity: 0 },
  { name: "Mayo", quantity: 0 },
  { name: "Yaqui", quantity: 0 },
  { name: "Pipil", quantity: 0 },
  { name: "Nahuatl", quantity: 2 },
];

/**
 * It is possible to add suffix content to the search bar,
 * for example buttons to trigger new actions, a drop-down, context menu.
 */
export const SearchWithSuffix: Story = {
  name: "Search + Suffix slot",
  render: template(languageTree),
  args: {
    search: true,
    searchPlaceHolder: "Search languages…",
    searchValue: "nor",
    suffix: `<apux-button icon="redo" variant="tertiary" size="small"></apux-button>
      <apux-button icon="plus" size="small">New</apux-button>
      <apux-toggle-button size="small" icon="star"></apux-toggle-button>`,
  },
};

/**
 * If the `search` event is cancelled, it is possible to add custom filtering.
 * Normally this is used to integrate with big quantities of items stored
 * in the backend. Removing/adding elements dynamically requires custom
 * handling for selection as well.
 *
 * See the Story tab in the Canvas for the code sample.
 */
export const SearchCustom: Story = {
  render: template(languageTree, {
    reference: (tree?: Element) => {
      if (!(tree instanceof window.ApuxTreeView)) {
        return;
      }
      const clear = () => {
        tree.querySelectorAll("apux-tree-view-item").forEach((i) => {
          i.querySelector(":scope > strong")?.remove();
          i.filterBy(true);
        });
      };

      tree?.addEventListener("search", (ev) => {
        // This is the important bit, disallow search.
        ev.preventDefault();
        const minimumSpeakers = Number.parseInt(tree.searchValue);
        // Search values, including .search are not handled anymore by the tree.
        if (!tree.search || Number.isNaN(minimumSpeakers)) {
          clear();
          return;
        }
        const languages = languageSpeakers.filter(
          ({ quantity }) => quantity >= minimumSpeakers
        );
        // Not efficient, n*m, it is OK for this example or small samples.
        const items = tree.querySelectorAll("apux-tree-view-item");
        items.forEach((item) => {
          const language = languages.find(({ name }) => name === item.text);
          // This method must be called to indicate the item is filtered in.
          item.filterBy(!!language);
          const amountLabel =
            item.querySelector(":scope > strong") ??
            document.createElement("strong");
          amountLabel.innerHTML = language
            ? `&nbsp;(${language.quantity}M)`
            : "";
          item.appendChild(amountLabel);
        });
      });
    },
  }),
  name: "Search (custom method)",
  args: {
    search: true,
    searchPlaceHolder: "≥ number of speakers in millions",
  },
};

const fruitsTree = html`<apux-tree-view-item open text="Apples">
  <apux-tree-view-item text="Green Apple"></apux-tree-view-item>
  <apux-tree-view-item text="Cortland Apple"></apux-tree-view-item>
  <apux-tree-view-item text="Fuji Apple"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Pears">
  <apux-tree-view-item text="Asian pear"></apux-tree-view-item>
  <apux-tree-view-item text="Bartlett pear"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item open text="Citrus">
  <apux-tree-view-item text="Oranges">
    <apux-tree-view-item text="Mandarins">
      <apux-tree-view-item text="Tangerines"></apux-tree-view-item>
      <apux-tree-view-item text="Swatow"></apux-tree-view-item>
    </apux-tree-view-item>
  </apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Grapefruits">
  <apux-tree-view-item text="Red Grapefruits"></apux-tree-view-item>
  <apux-tree-view-item text="White Grapefruits"></apux-tree-view-item>
  <apux-tree-view-item text="Pink Grapefruits"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Limes"></apux-tree-view-item>
<apux-tree-view-item text="Nectarines"></apux-tree-view-item>
<apux-tree-view-item text="Apricots"></apux-tree-view-item>
<apux-tree-view-item text="Plums"></apux-tree-view-item>
<apux-tree-view-item text="Peaches">
  <apux-tree-view-item text="Yellow Peaches"></apux-tree-view-item>
  <apux-tree-view-item text="Donut Peaches"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Strawberries"></apux-tree-view-item>
<apux-tree-view-item text="Raspberries"></apux-tree-view-item>
<apux-tree-view-item text="Blueberries">
  <apux-tree-view-item text="High bush blueberries"></apux-tree-view-item>
  <apux-tree-view-item text="Rabbit eye blueberries"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Kiwifruit"></apux-tree-view-item>
<apux-tree-view-item text="Passion fruit"></apux-tree-view-item>
</apux-tree-view-item>
<apux-tree-view-item text="Watermelons"></apux-tree-view-item>
<apux-tree-view-item text="Rock melons"></apux-tree-view-item>
<apux-tree-view-item text="Honeydew melons"></apux-tree-view-item>
<apux-tree-view-item text="Tomatoes"></apux-tree-view-item>
<apux-tree-view-item text="Avocados">
  <apux-tree-view-item text="Pinkerton Avocados"></apux-tree-view-item>
  <apux-tree-view-item text="Gwen Avocados"></apux-tree-view-item>
</apux-tree-view-item>`;

const longTextTree = html`<apux-tree-view-item open text="Long words">
  <apux-tree-view-item
    text="Pneumonoultramicroscopicsilicovolcanoconiosis"
  ></apux-tree-view-item>
  <apux-tree-view-item
    text="Supercalifragilisticexpialidocious"
  ></apux-tree-view-item>
  <apux-tree-view-item
    text="Floccinaucinihilipilification"
  ></apux-tree-view-item>
  <apux-tree-view-item
    text="Antidisestablishmentarianism"
  ></apux-tree-view-item>
</apux-tree-view-item>`;

const treeItems = [
  "Pineapple",
  "Pomegranate",
  "Star Fruit",
  "Lychee",
  "Gooseberry",
  "Cranberry",
];

const emulatedDelayOfAPI = 1000;
const maximumRandomSamples = 30;
const fetchItems = () =>
  new Promise<string[]>((resolve) => {
    setTimeout(() => {
      const numberOfSamples = Math.round(Math.random() * maximumRandomSamples);
      const samples = Array(numberOfSamples)
        .fill(null)
        .map(
          () => treeItems[Math.round(Math.random() * (treeItems.length - 1))]
        );
      resolve(samples);
    }, emulatedDelayOfAPI);
  });

/**
 * Dispatch a `load-more event` when the scroll reaches
 * its end - `load-more-on`,
 * which can be captured by user to fetch new items from backend.
 *
 * This sample emulates a fetch call to a server (generates random data and
 * delays 1 second), additionally it adds a loading indicator.
 */
export const LazyLoadEvent: Story = {
  render: template(fruitsTree, {
    reference: (tree?: Element) => {
      if (!(tree instanceof window.ApuxTreeView)) {
        return;
      }
      let loading = false;
      const loadMore = document.createElement("apux-tree-view-item");
      loadMore.id = "loading";
      loadMore.style.cssText = `background-image: linear-gradient(to top, rgb(192 192 192 / 31%), transparent);
      opacity: 0.7;border-radius: 5px;`;
      loadMore.textContent = "Loading......";

      tree.addEventListener("load-more", () => {
        const loadingIndicator = tree.querySelectorAll("#loading");
        if (loading || loadingIndicator.length > 0) {
          return;
        }
        loading = true;
        tree.append(loadMore);
        fetchItems().then((samples) => {
          samples.forEach((sample) => {
            const treeItem = document.createElement("apux-tree-view-item");
            treeItem.setAttribute("text", sample);
            tree.append(treeItem);
          });
          loadMore.remove();
          loading = false;
        });
      });
    },
  }),
  name: "Event (Lazy load)",
  args: {
    loadMoreOn: "100px",
  },
  parameters: {
    actions: {
      handles: ["load-more"],
    },
  },
};

/**
 * A scrollbar appears if the tree-view content is too big.
 * Scrollbar adapts to the tree-view search bar *(It appears below it)*.
 *
 * To test this use story controls to change **search**
 * property to false and vice versa.
 *
 * *This also does not interfere with the lazy loading functionality,*
 * *presented in this*
 * *[story](/story/general-tree-view-tree-view--lazy-load-event)*.
 */
export const ScrollBar: Story = {
  render: template(fruitsTree),
  args: {
    search: true,
  },
  name: "Adaptive scrollbar",
};

/**
 * Text in `tree-view-item` will display an **ellipsis** to represent clipped text,
 * whenever there isn't enough place to show the whole content.
 *
 * *Grab the dashed border from the right-bottom to change the size of the `tree-view`*.
 */
export const Responsive: Story = {
  render: template(longTextTree),
  decorators: [responsive({ width: 600 })],
  args: {
    search: true,
    searchPlaceHolder: "Filter words",
  },
  name: "Responsiveness",
};

/**
 * When the `list` property is set to true,
 * the tree view will display all elements as if they were first level.
 * Nesting is disabled visually, no expander is shown. This mode is useful
 * when the tree view is used as a list of items. Despite nesting is still working,
 * it is not recommended to use it in this mode, for that purpose remove the `list`
 * property and use the tree view as a normal tree.
 */
export const ListMode: Story = {
  render: template(languageTree),
  args: {
    list: true,
  },
};

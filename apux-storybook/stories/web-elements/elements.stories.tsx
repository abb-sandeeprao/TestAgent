import * as React from "react";
import { Title, Subtitle, Description, Stories } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/web-components";
import { html } from "lit-html";

/**
 * Styling of browser's basic web elements.
 *
 * ## About our font family
 *
 * **ABBvoice** is the bespoke typeface linked to our company’s roots and tailored to the needs of the digital world. It gives us a common voice with a unique character, boosting brand recognition and reinforcing tonality throughout all software products as a perfect complement to our CommonUX UI components.
 */
const meta = {
  title: "Web elements",
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Stories includePrimary={true} />
        </>
      ),
    },
  },
} as Meta;

export default meta;

export const Headlines: StoryFn = () => {
  return html`<div>
    <h1>Headline 1</h1>
    <h2>Headline 2</h2>
    <h3>Headline 3</h3>
    <h4>Headline 4</h4>
  </div>`;
};

export const Paragraphs: StoryFn = () => {
  return html`<p>
      Peter Pan is a fictional character created by Scottish novelist and
      playwright J. M. Barrie. A free-spirited and mischievous young boy who can
      fly and never grows up, Peter Pan spends his never-ending childhood having
      adventures on the mythical island of Neverland as the leader of the Lost
      Boys, interacting with fairies, pirates, mermaids, Native Americans, and
      occasionally ordinary children from the world outside Neverland.
    </p>
    <p>
      The Wicked Witch of the West is a fictional character who appears in the
      classic children's novel The Wonderful Wizard of Oz (1900), created by
      American author L. Frank Baum. In Baum's subsequent Oz novels, it is the
      Nome King who is the principal villain; the Wicked Witch of the West is
      rarely even referred to again after her death in the first book.
    </p>`;
};

/**
 * Allows navigate to other pages or anchors in the same page.
 */
export const Link: StoryFn = () => {
  return html`This is a link to the <a href="/">Home page</a>.`;
};

/**
 * Highlight a piece of information.
 */
export const Strong: StoryFn = () => {
  return html`This is a <strong>very important</strong> message.`;
};

/**
 * Emphasize a piece of information.
 */
export const Emphasized: StoryFn = () => {
  return html`This <em>requires special attention</em> right now.`;
};

/**
 * Allows to introduce pre-formatted text that looks like code.
 */
export const Code: StoryFn = () => {
  return html`<pre>
  function start() {
    return true;
  }

  start();
  </pre
  >`;
};

/**
 * Allows to shortly mention a concept shortly and expanding
 * its meaning by hovering it.
 */
export const Abbreviations: StoryFn = () => {
  return html`Our <abbr title="User Interface/User Experience">UI/UX</abbr>.`;
};

/**
 * Users have the flexibility to specify various font weights for styling
 * HTML elements. By default, two common font weights are readily available:
 * <strong>bold (700)</strong> for emphasizing key content and <strong>normal (400)</strong> for standard text.
 * Additionally, light (300) and medium (500) weights are provided to offer
 * more nuanced control over typography can be used by importing and using
 * $font-weight-medium; $font-weight-light variables.
 */
export const FontWeight: StoryFn = () => {
  return html` <p style="font-weight:bold">This text is bold(700).</p>

    <p style="font-weight:normal">This text normal(400).</p>

    <p style="font-weight:500">This text is medium(500).</p>

    <p style="font-weight:300">This text is light(300).</p>`;
};

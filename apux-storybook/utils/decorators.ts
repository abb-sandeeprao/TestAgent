import { StoryObj } from "@storybook/web-components";
import { html } from "lit-html";
import { space } from "@abb-hmi/apux/css-in-js";

type ElementType<Elements extends unknown[] | undefined> =
  Elements extends readonly (infer Element)[] ? Element : never;

type Params = {
  resize?: "horizontal" | "both";
  padding?: boolean;
  /** Width in pixels. */
  width?: number;
  /** Height in pixels. */
  height?: "default" | number;
};

const defaultResponsiveSize = 400;

/**
 * Wraps the story in a blue box that can be resized to show responsiveness.
 */
export function responsive({
  resize,
  padding,
  width,
  height,
}: Params): ElementType<StoryObj<unknown>["decorators"]> {
  return (story) => {
    return html`<div
      style=${[
        `width: ${width ?? defaultResponsiveSize}px`,
        height === undefined
          ? undefined
          : `height: ${
              height === "default" ? defaultResponsiveSize : height
            }px`,
        `resize:${resize ?? "horizontal"}`,
        "border: dashed var(--apux-state-info) 3px",
        `padding:${padding !== false ? space : "0"}`,
        "overflow: hidden",
      ]
        .filter((x) => x)
        .join("; ")}
    >
      ${story()}
    </div>`;
  };
}

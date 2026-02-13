import apuxStyles from "@abb-hmi/apux/dist/apux.css";
import commonCss from "../stories/simple-components/styles/style.css";

export const attributeTemplate = (check, value) => {
  return check ? ` ${value}` : "";
};

export const attachStyles = () => {
  let style = document.createElement("style");
  style.innerHTML = apuxStyles;
  document.head.append(style);
  style = document.createElement("style");
  style.innerHTML = commonCss;
  document.head.append(style);
};

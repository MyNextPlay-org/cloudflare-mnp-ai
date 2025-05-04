import "./example.css";
import { html } from "@respond-run/html";

export default {
  count: 0,

  increment() {
    this.count++;
  },

  render: async function () {
    const { default: exampleTemplate } = await import("./example.html?raw");
    return html(exampleTemplate, {
      /* pass your props here */
    });
  },
};

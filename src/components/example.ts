import { html } from '@respond-run/html';

export default {
  name: "example",
  count: 0,

  increment() {
    this.count++;
  },

  render() {
    return html`
      <div x-data="${this.name}()" class="space-x-2">
        <button @click="increment()">+</button>
        <span x-text="count"></span>
      </div>
    `;
  }
};

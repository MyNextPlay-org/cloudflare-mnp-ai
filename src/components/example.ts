import { html } from '@dropsite/respond';

export default {
  count: 0,

  increment() {
    this.count++;
  },

  render(data: string) {
    return html`
      <div x-data="${data}" class="space-x-2">
        <button @click="increment()">+</button>
        <span x-text="count"></span>
      </div>
    `;
  }
};

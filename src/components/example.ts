import { template } from "../helpers/templates";

export default {
  name: "example",
  count: 0,

  increment() {
    this.count++;
  },

  render() {
    return template("example", { name: this.name });
  },
};

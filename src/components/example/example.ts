import "./example.css";
import { template } from "../../helpers/templates";

export default {
  count: 0,

  increment() {
    this.count++;
  },

  render() {
    return template("example");
  },
};

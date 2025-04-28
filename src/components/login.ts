import { handlePasskeyAuth } from "../helpers/passkey-client";
import { template } from "../helpers/templates";

export default {
  name: "login",
  email: "",
  error: "",

  async submit() {
    const resp = await handlePasskeyAuth(this.email);
    if ("error" in resp && resp.error) {
      this.error = resp.error;
    } else {
      window.location.href = "/";
    }
  },

  render() {
    return template("login", { name: this.name });
  },
};

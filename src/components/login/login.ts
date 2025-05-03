import "./login.css";
import { handlePasskeyAuth } from "../../helpers/passkey-client";
import { template } from "../../helpers/templates";
import logo from "../../assets/logo.png";
import passkey from "../../assets/passkey.svg";

export default {
  email: "",
  error: "",
  _autoLoginTriggered: false,

  async submit() {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email }),
    });

    if (!res.ok) {
      throw new Error(`Login failed with status ${res.status}`);
    }

    const data = (await res.json()) as { status: string };

    if (data.status === "existing") {
      const resp = await handlePasskeyAuth(this.email);
      if ("error" in resp && resp.error) {
        this.error = resp.error;
      } else {
        window.location.href = "/";
      }
    } else if (data.status === "signup_started") {
      this.error = "Check your email for verification link.";
    } else {
      console.warn("Unexpected status:", data.status);
    }
  },

  async init() {
    // Only run if not already triggered
    if (this._autoLoginTriggered) return;
    this._autoLoginTriggered = true;
    try {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        this.email = decodeURIComponent(emailParam);
        await this.submit();
      }
    } catch (e) {
      // Ignore errors
    }
  },

  render() {
    return template("login", { logo, passkey });
  },
};

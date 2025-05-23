import "./chat.css";
import { html } from "@respond-run/html";
import { marked } from "marked";
import logo from "@/assets/logo.svg";

export default {
  input: "",
  messages: [] as { role: string; content: string; html?: string }[],
  sending: false,

  scrollToBottom() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  },

  async sendMessage(e: Event) {
    e.preventDefault();
    if (!this.input.trim()) return;

    const userMessage = this.input.trim();
    this.messages.push({ role: "user", content: userMessage });
    this.input = "";
    this.sending = true;

    const assistantMessage = { role: "assistant", content: "", html: "" };
    this.messages.push(assistantMessage);

    const safeMessages = this.messages.map(({ role, content }) => ({ role, content }));

    const response = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: safeMessages }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const json = line.slice(6).trim();
        if (!json || json === "[DONE]") continue;

        try {
          const parsed = JSON.parse(json);
          const delta = parsed.response || "";
          const lastMsg = this.messages[this.messages.length - 1];

          lastMsg.content += delta;
          lastMsg.html = marked.parse(lastMsg.content) as string;
          this.messages = [...this.messages];

          this.scrollToBottom();
        } catch (err) {
          console.warn("Could not parse line:", line, err);
        }
      }
    }

    this.sending = false;
  },

  render: async function () {
    const { default: chatTemplate } = await import("./chat.html?raw");
    return html(chatTemplate, {
      logo,
    });
  },
};

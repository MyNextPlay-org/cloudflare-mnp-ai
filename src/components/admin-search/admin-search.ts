import "./admin-search.css";
import { html } from "@respond-run/html";

type Match = {
  id: string;
  score: number;
  metadata?: Record<string, any>;
};

export default {
  query: "",
  matches: [] as Match[],
  searched: false,

  async search() {
    this.searched = false;
    try {
      const res = await fetch("/api/admin/search/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: this.query }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = (await res.json()) as { matches: Match[] };
      this.matches = data.matches;
    } catch (err) {
      console.error(err);
      this.matches = [];
    } finally {
      this.searched = true;
    }
  },

  init() {
    // Nothing to preload
  },

  render: async function () {
    const { default: tpl } = await import("./admin-search.html?raw");
    return html(tpl, {});
  },
};

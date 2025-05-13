import "./admin-search.css";
import { html } from "@respond-run/html";

type Match = {
  id: string;
  score: number;
  metadata?: Record<string, any>;
  title: string;
  content: string;
  created_at: string;
  drive_file_id?: string;
  drive_id?: string;
};

export default {
  query: "",
  matches: [] as Match[],
  searched: false,
  lastSyncTime: null as string | null,

  async search() {
    this.searched = false;
    try {
      // If we just synced, wait for vectors to be processed
      if (this.lastSyncTime) {
        const syncTime = new Date(this.lastSyncTime).getTime();
        const now = new Date().getTime();
        const timeSinceSync = now - syncTime;

        // If less than 10 seconds since sync, wait
        if (timeSinceSync < 10000) {
          await new Promise((resolve) => setTimeout(resolve, 10000 - timeSinceSync));
        }
      }

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

  // Call this after a successful sync
  onSyncComplete() {
    this.lastSyncTime = new Date().toISOString();
  },

  init() {
    // Nothing to preload
  },

  render: async function () {
    const { default: tpl } = await import("./admin-search.html?raw");
    return html(tpl, {});
  },
};

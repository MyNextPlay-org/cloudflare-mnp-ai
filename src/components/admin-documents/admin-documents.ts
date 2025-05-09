import "./admin-documents.css";
import { Document } from "@/models/document";
import { html } from "@respond-run/html";

export default {
  docs: [] as Document[],
  showCopy: true,
  copyText: "Copy",
  showView: false,
  showDelete: false,
  showAdd: false,
  selectedDoc: null as Document | null,
  newDocTitle: "",
  newDocContent: "",

  async fetchDocs() {
    const res = await fetch("/api/admin/documents");
    this.docs = await res.json();
  },

  openView(doc: Document) {
    this.selectedDoc = doc;
    this.showView = true;
  },

  openDelete(doc: Document) {
    this.selectedDoc = doc;
    this.showDelete = true;
  },

  async deleteDoc() {
    if (!this.selectedDoc) return;
    await fetch(`/api/admin/documents/${encodeURIComponent(this.selectedDoc.id)}`, {
      method: "DELETE",
    });
    this.showDelete = false;
    await this.fetchDocs();
  },

  openAdd() {
    this.newDocTitle = "";
    this.newDocContent = "";
    this.showAdd = true;
  },

  async createDoc() {
    await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: this.newDocTitle, content: this.newDocContent }),
    });
    this.showAdd = false;
    await this.fetchDocs();
  },

  async copyContent() {
    if (!this.selectedDoc) return;
    try {
      await navigator.clipboard.writeText(this.selectedDoc.content);

      // hide "Copy", show "Copied!"
      this.showCopy = false;
      this.copyText = "Copied!";
      setTimeout(() => {
        this.copyText = "Copy";
        this.showCopy = true;
      }, 750);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  },

  async init() {
    await this.fetchDocs();
  },

  render: async function () {
    const { default: adminDocumentsTemplate } = await import("./admin-documents.html?raw");
    return html(adminDocumentsTemplate, {
      /* pass your props here */
    });
  },
};

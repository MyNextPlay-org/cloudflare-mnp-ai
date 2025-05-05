import "./admin-users.css";
import { User } from "@/models/user";
import { html } from "@respond-run/html";

export default {
  users: [] as User[],
  showView: false,
  showDelete: false,
  showAdd: false,
  selectedUser: null as User | null,
  newUserEmail: "",
  async fetchUsers() {
    const res = await fetch("/api/admin/users");
    this.users = await res.json();
  },
  view(u: User) {
    this.selectedUser = u;
    this.showView = true;
  },
  confirmDelete(u: User) {
    this.selectedUser = u;
    this.showDelete = true;
  },
  async deleteUser() {
    if (!this.selectedUser) return;
    await fetch(`/api/admin/users/${encodeURIComponent(this.selectedUser.email)}`, {
      method: "DELETE",
    });
    this.showDelete = false;
    await this.fetchUsers();
  },
  openAdd() {
    this.newUserEmail = "";
    this.showAdd = true;
  },
  async createUser() {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.newUserEmail }),
    });
    this.showAdd = false;
    await this.fetchUsers();
  },
  async init() {
    await this.fetchUsers();
  },
  render: async function () {
    const { default: adminUsersTemplate } = await import("./admin-users.html?raw");
    return html(adminUsersTemplate, {
      /* pass your props here */
    });
  },
};

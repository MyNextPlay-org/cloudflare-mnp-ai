import "./admin-drives.css";
import { Drive } from "@/helpers/google-drive";
import { html } from "@respond-run/html";

type UserDrive = {
  id: string;
  drive_id: string;
  name: string;
  file_count: number;
  last_synced_at: string | null;
};

export default {
  drives: [] as UserDrive[],
  availableDrives: [] as Drive[],
  showSelect: false,
  showRemove: false,
  selectedDrive: null as UserDrive | null,
  selectedDriveIds: [] as string[],
  connected: false,

  async checkDriveConnected() {
    const res = await fetch("/api/admin/drives/connected");
    this.connected = ((await res.json()) as { connected: boolean }).connected;
  },

  async fetchAvailableDrives() {
    const res = await fetch("/api/admin/drives/list");
    this.availableDrives = await res.json();
    this.showSelect = true;
  },

  async fetchUserDrives() {
    const res = await fetch("/api/admin/drives");
    this.drives = await res.json();
  },

  async importDrives() {
    await fetch("/api/admin/drives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driveIds: this.selectedDriveIds }),
    });
    this.showSelect = false;
    await this.fetchUserDrives();
  },

  async syncDrive(driveId: string) {
    await fetch(`/api/admin/drives/${encodeURIComponent(driveId)}/sync`, {
      method: "POST",
    });
    await this.fetchUserDrives();
  },

  openRemove(drive: UserDrive) {
    this.selectedDrive = drive;
    this.showRemove = true;
  },

  async removeDrive() {
    if (!this.selectedDrive) return;
    await fetch(`/api/admin/drives/${encodeURIComponent(this.selectedDrive.id)}/remove`, {
      method: "DELETE",
    });
    this.showRemove = false;
    await this.fetchUserDrives();
  },

  connectDrive() {
    window.location.href = "/api/admin/drives/connect";
  },

  async init() {
    await this.checkDriveConnected();
    await this.fetchUserDrives();
  },

  render: async function () {
    const { default: adminDrivesTemplate } = await import("./admin-drives.html?raw");
    return html(adminDrivesTemplate, {
      /* pass your props here */
    });
  },
};

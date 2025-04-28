import { raw } from "@respond-run/html";
import { template } from "../helpers/templates";
import favIcon from "../../assets/favicon.ico";

export default {
  render(vars: { body: string; title: string; scriptPath: string; stylePath?: string }) {
    const styleLink = vars.stylePath ? raw(`<link rel="stylesheet" href="${vars.stylePath}">`) : "";
    return template("layout", { ...vars, body: raw(vars.body), favIcon, styleLink });
  },
};

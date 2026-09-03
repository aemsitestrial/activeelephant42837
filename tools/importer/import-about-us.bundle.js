/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });
  var import_about_us_default = {
    transformDOM: ({ document }) => {
      const source = document.querySelector("main") || document.body;
      const out = document.createElement("div");
      const sections = [...source.querySelectorAll(":scope > section")];
      const pushBreak = () => {
        if (out.lastElementChild) out.append(document.createElement("hr"));
      };
      sections.forEach((section) => {
        const block = section.getAttribute("data-block");
        if (block === "hero") {
          pushBreak();
          const img = section.querySelector("img");
          const copy = [...section.querySelectorAll("h1, p")];
          const table = WebImporter.DOMUtils.createTable([
            ["Hero"],
            [img],
            [copy]
          ], document);
          out.append(table);
        } else if (block === "columns") {
          pushBreak();
          const cols = [...section.querySelectorAll(":scope > div")].map((c) => [...c.childNodes]);
          const table = WebImporter.DOMUtils.createTable([
            ["Columns"],
            cols
          ], document);
          out.append(table);
        } else if (block === "cards") {
          pushBreak();
          const heading = section.querySelector(":scope > h2");
          if (heading) out.append(heading);
          const rows = [["Cards"]];
          section.querySelectorAll(":scope > .card").forEach((card) => {
            const img = card.querySelector("img");
            const text = [...card.querySelectorAll("h3, p")];
            rows.push([img, text]);
          });
          const table = WebImporter.DOMUtils.createTable(rows, document);
          out.append(table);
          const style = section.getAttribute("data-style");
          if (style) {
            out.append(WebImporter.DOMUtils.createTable([
              ["Section Metadata"],
              ["style", style]
            ], document));
          }
        } else {
          pushBreak();
          [...section.children].forEach((child) => out.append(child));
        }
      });
      return out;
    },
    generateDocumentPath: ({ url }) => {
      const rawPath = new URL(url).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      return WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
    }
  };
  return __toCommonJS(import_about_us_exports);
})();

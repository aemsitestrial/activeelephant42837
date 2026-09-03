/* global WebImporter */

/**
 * Import script for the authored "About Us" source page.
 *
 * The source (tools/importer/bd-snapshots/local.source/about-us.html) is a plain
 * semantic page whose sections are tagged with data-block. This transform turns
 * each section into the corresponding Edge Delivery block table (Hero, Columns,
 * Cards) or default content, inserting section breaks (<hr>) between them.
 */

export default {
  transformDOM: ({ document }) => {
    const source = document.querySelector('main') || document.body;
    const out = document.createElement('div');

    const sections = [...source.querySelectorAll(':scope > section')];

    const pushBreak = () => {
      // A thematic break becomes `---` in markdown → a new EDS section.
      if (out.lastElementChild) out.append(document.createElement('hr'));
    };

    sections.forEach((section) => {
      const block = section.getAttribute('data-block');

      if (block === 'hero') {
        pushBreak();
        const img = section.querySelector('img');
        const copy = [...section.querySelectorAll('h1, p')];
        const table = WebImporter.DOMUtils.createTable([
          ['Hero'],
          [img],
          [copy],
        ], document);
        out.append(table);
      } else if (block === 'columns') {
        pushBreak();
        const cols = [...section.querySelectorAll(':scope > div')].map((c) => [...c.childNodes]);
        const table = WebImporter.DOMUtils.createTable([
          ['Columns'],
          cols,
        ], document);
        out.append(table);
      } else if (block === 'cards') {
        pushBreak();
        const heading = section.querySelector(':scope > h2');
        if (heading) out.append(heading);
        const rows = [['Cards']];
        section.querySelectorAll(':scope > .card').forEach((card) => {
          const img = card.querySelector('img');
          const text = [...card.querySelectorAll('h3, p')];
          rows.push([img, text]);
        });
        const table = WebImporter.DOMUtils.createTable(rows, document);
        out.append(table);

        // Section styling (e.g. highlight background) via Section Metadata.
        const style = section.getAttribute('data-style');
        if (style) {
          out.append(WebImporter.DOMUtils.createTable([
            ['Section Metadata'],
            ['style', style],
          ], document));
        }
      } else {
        // Default content section (intro, cta): move children as-is.
        pushBreak();
        [...section.children].forEach((child) => out.append(child));
      }
    });

    return out;
  },

  generateDocumentPath: ({ url }) => {
    const rawPath = new URL(url).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    return WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
  },
};

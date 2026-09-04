import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const IMAGE_URL_RE = /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i;
const AEM_ASSETS_DELIVERY_RE = /\/adobe\/assets\/urn:aaid:aem:/i;

function looksLikeImageUrl(url) {
  if (!url) return false;
  return IMAGE_URL_RE.test(url) || AEM_ASSETS_DELIVERY_RE.test(url);
}

/**
 * External AEM Assets delivery URLs arrive as a bare <a> link rather than a
 * <picture>. Convert any such link inside the row into a real <picture><img> so
 * the grid tile shows the image instead of a URL.
 */
function normalizeImageLinks(row) {
  row.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    const label = anchor.textContent.trim();
    if (!looksLikeImageUrl(href)) return;
    if (label && label !== href && !looksLikeImageUrl(label)) return;

    const title = anchor.getAttribute('title') || '';
    const alt = (title && title !== href && !looksLikeImageUrl(title)) ? title : '';

    const img = document.createElement('img');
    img.src = href;
    img.setAttribute('alt', alt);

    const picture = document.createElement('picture');
    picture.append(img);

    const wrapper = anchor.closest('p') || anchor;
    wrapper.replaceWith(picture);
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    normalizeImageLinks(row);

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const picture = row.querySelector('picture');
    if (picture) {
      const figure = document.createElement('figure');
      figure.className = 'grid-item-image';
      figure.append(picture);

      // Any remaining text becomes the caption (last cell, if it has content).
      const captionCell = cells.find((cell) => !cell.querySelector('picture') && cell.textContent.trim());
      if (captionCell) {
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'grid-item-caption';
        while (captionCell.firstChild) figcaption.append(captionCell.firstChild);
        figure.append(figcaption);
      }
      li.append(figure);
    } else {
      // No image: keep the cell content as-is inside the tile.
      while (row.firstElementChild) li.append(row.firstElementChild);
    }

    ul.append(li);
  });

  // Optimize images for the gallery.
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}

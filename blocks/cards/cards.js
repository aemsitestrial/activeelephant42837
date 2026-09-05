import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const IMAGE_URL_RE = /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i;
const AEM_ASSETS_DELIVERY_RE = /\/adobe\/assets\/urn:aaid:aem:/i;

function looksLikeImageUrl(url) {
  if (!url) return false;
  return IMAGE_URL_RE.test(url) || AEM_ASSETS_DELIVERY_RE.test(url);
}

function isExternalUrl(url) {
  try {
    return new URL(url, window.location.href).origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}

// External AEM Assets delivery URLs arrive as an <a> link (sometimes button-
// styled) rather than a <picture>. Convert any image link into a real <img>.
function normalizeImageLinks(root) {
  root.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!looksLikeImageUrl(href)) return;

    const label = anchor.textContent.trim();
    const title = anchor.getAttribute('title') || '';
    let alt = '';
    if (title && title !== href && !looksLikeImageUrl(title)) alt = title;
    else if (label && label !== href && !looksLikeImageUrl(label)) alt = label;

    const img = document.createElement('img');
    img.src = href;
    img.setAttribute('alt', alt);
    img.loading = 'lazy';

    const picture = document.createElement('picture');
    picture.append(img);

    const wrapper = anchor.closest('p') || anchor;
    wrapper.replaceWith(picture);
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    normalizeImageLinks(row);

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // Same-origin images get optimized; external delivery URLs keep their
    // absolute src (optimizing would strip the host and 404).
    if (isExternalUrl(img.src)) {
      img.loading = 'lazy';
      return;
    }
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}

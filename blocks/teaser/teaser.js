const IMAGE_URL_RE = /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i;
const AEM_ASSETS_DELIVERY_RE = /\/adobe\/assets\/urn:aaid:aem:/i;

function looksLikeImageUrl(url) {
  if (!url) return false;
  return IMAGE_URL_RE.test(url) || AEM_ASSETS_DELIVERY_RE.test(url);
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

const LAYOUTS = ['side-by-side', 'overlay'];

export default function decorate(block) {
  normalizeImageLinks(block);

  // A trailing cell may hold the `layout` select value (e.g. "overlay").
  // Detect it, apply the matching class, and remove it from the content.
  const rows = [...block.children];
  const lastRow = rows[rows.length - 1];
  const lastText = lastRow && !lastRow.querySelector('picture')
    ? lastRow.textContent.trim().toLowerCase()
    : '';
  if (LAYOUTS.includes(lastText)) {
    block.classList.add(`teaser-${lastText}`);
    lastRow.remove();
  } else {
    block.classList.add('teaser-side-by-side');
  }

  const picture = block.querySelector('picture');
  const imageWrap = document.createElement('div');
  imageWrap.className = 'teaser-image';
  if (picture) imageWrap.append(picture);

  const content = document.createElement('div');
  content.className = 'teaser-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) return;
      while (cell.firstChild) content.append(cell.firstChild);
    });
  });

  block.textContent = '';
  if (picture) block.append(imageWrap);
  block.append(content);
}

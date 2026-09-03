/**
 * Hero block.
 *
 * The image cell may arrive as a real <picture> (local DAM asset) OR — when the
 * asset is an external AEM Assets delivery URL (delivery-*.adobeaemcloud.com/
 * adobe/assets/urn:aaid:aem:...) — as a bare <a> link to the image, which the
 * content renderer does NOT turn into a picture. Normalize the latter into an
 * <img> so the hero background renders in all cases.
 */

const IMAGE_URL_RE = /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i;
const AEM_ASSETS_DELIVERY_RE = /\/adobe\/assets\/urn:aaid:aem:/i;

function looksLikeImageUrl(url) {
  if (!url) return false;
  return IMAGE_URL_RE.test(url) || AEM_ASSETS_DELIVERY_RE.test(url);
}

export default function decorate(block) {
  block.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    // Only convert when the link points to an image and isn't a real text link
    // (i.e. its label is empty or is just the URL itself).
    const label = anchor.textContent.trim();
    if (!looksLikeImageUrl(href)) return;
    if (label && label !== href && !looksLikeImageUrl(label)) return;

    // EDS autolinking sets title === href; treat that as "no real alt".
    const title = anchor.getAttribute('title') || '';
    const alt = (title && title !== href && !looksLikeImageUrl(title)) ? title : '';

    const img = document.createElement('img');
    img.src = href;
    img.setAttribute('alt', alt);
    img.loading = 'eager';

    const picture = document.createElement('picture');
    picture.append(img);

    // Remove the anchor (and its wrapping cell), then append the picture as a
    // DIRECT child of the hero block. The hero CSS positions `.hero picture`
    // absolutely against the hero box (which has min-height); leaving it inside
    // the original 0-height content cell would collapse the image to height 0.
    const cell = anchor.closest(':scope > div, p') || anchor;
    const topCell = anchor.closest(':scope > div');
    if (topCell && topCell.parentElement === block) {
      topCell.remove();
    } else {
      cell.remove();
    }
    block.prepend(picture);
  });
}

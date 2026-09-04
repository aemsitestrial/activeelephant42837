import { moveInstrumentation } from '../../scripts/scripts.js';

const IMAGE_URL_RE = /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i;
const AEM_ASSETS_DELIVERY_RE = /\/adobe\/assets\/urn:aaid:aem:/i;
const AUTO_INTERVAL = 6000;

function looksLikeImageUrl(url) {
  if (!url) return false;
  return IMAGE_URL_RE.test(url) || AEM_ASSETS_DELIVERY_RE.test(url);
}

// External AEM Assets delivery URLs arrive as an <a> link (sometimes button-
// styled) rather than a <picture>. Convert any image link to a real <img>.
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
    img.loading = 'eager';

    const picture = document.createElement('picture');
    picture.append(img);

    const wrapper = anchor.closest('p') || anchor;
    wrapper.replaceWith(picture);
  });
}

function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-slide');
  const dots = block.querySelectorAll('.carousel-dot');
  const total = slides.length;
  const next = (index + total) % total;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === next);
    slide.setAttribute('aria-hidden', i === next ? 'false' : 'true');
  });
  dots.forEach((dot, i) => dot.classList.toggle('active', i === next));
  block.dataset.activeSlide = next;
}

export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'carousel-slides';

  rows.forEach((row, i) => {
    normalizeImageLinks(row);

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.dataset.slideIndex = i;
    moveInstrumentation(row, slide);

    const picture = row.querySelector('picture');
    if (picture) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'carousel-slide-image';
      imageWrap.append(picture);
      slide.append(imageWrap);
    }

    // Remaining cells become the overlay content (title/text/button).
    const content = document.createElement('div');
    content.className = 'carousel-slide-content';
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) return;
      while (cell.firstChild) content.append(cell.firstChild);
    });
    if (content.textContent.trim() || content.querySelector('a')) slide.append(content);

    container.append(slide);
  });

  block.textContent = '';
  block.append(container);

  const slides = [...container.querySelectorAll('.carousel-slide')];
  if (!slides.length) return;

  // Single slide: no controls needed.
  if (slides.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';

    const prev = document.createElement('button');
    prev.className = 'carousel-arrow carousel-prev';
    prev.setAttribute('aria-label', 'Previous slide');
    prev.type = 'button';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-arrow carousel-next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.type = 'button';

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => showSlide(block, i));
      dots.append(dot);
    });

    prev.addEventListener('click', () => showSlide(block, Number(block.dataset.activeSlide || 0) - 1));
    nextBtn.addEventListener('click', () => showSlide(block, Number(block.dataset.activeSlide || 0) + 1));

    nav.append(prev, dots, nextBtn);
    block.append(nav);

    // Auto-advance; pause on hover.
    let timer = window.setInterval(
      () => showSlide(block, Number(block.dataset.activeSlide || 0) + 1),
      AUTO_INTERVAL,
    );
    block.addEventListener('mouseenter', () => window.clearInterval(timer));
    block.addEventListener('mouseleave', () => {
      timer = window.setInterval(
        () => showSlide(block, Number(block.dataset.activeSlide || 0) + 1),
        AUTO_INTERVAL,
      );
    });
  }

  showSlide(block, 0);
}

export default function decorate(block) {
  // The model's `style` select value arrives as the block's text content
  // (e.g. "line", "dotted", "dots", "spacer"). Default to "line".
  const style = (block.textContent || '').trim().toLowerCase() || 'line';
  const known = ['line', 'dotted', 'dots', 'spacer'];
  const variant = known.includes(style) ? style : 'line';

  block.textContent = '';
  block.classList.add(`divider-${variant}`);
  block.setAttribute('role', 'separator');

  // The "dots" variant renders three dots: two via ::before/::after and a
  // middle one that needs a real element.
  if (variant === 'dots') {
    block.append(document.createElement('span'));
  }
}

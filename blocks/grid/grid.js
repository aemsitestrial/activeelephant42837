import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
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

const DATA_URL = 'daten.json';

const infoPopUp = document.querySelector('#info-pop-up');
const popUpClose = infoPopUp?.querySelector('.pop-up-close');
const popUpTitle = infoPopUp?.querySelector('.pop-up-title');
const popUpText = infoPopUp?.querySelector('.pop-up-text');

const openPopUp = (title, text) => {
  if (!infoPopUp || !popUpClose || !popUpTitle || !popUpText) {
    return;
  }

  popUpTitle.textContent = title;
  popUpText.textContent = text;
  infoPopUp.hidden = false;
  infoPopUp.classList.add('is-open');
  popUpClose.focus();
};

const closePopUp = () => {
  if (!infoPopUp) {
    return;
  }

  infoPopUp.classList.remove('is-open');
  infoPopUp.hidden = true;
};

const createCompareCard = (entry) => {
  const template = document.querySelector('#compare-card-template');
  const article = template.content.firstElementChild.cloneNode(true);

  const leftLabel = article.querySelector('.compare-label.left');
  const rightLabel = article.querySelector('.compare-label.right');
  const baseImage = article.querySelector('.compare-base');
  const overlayImage = article.querySelector('.compare-overlay img');
  const title = article.querySelector('.compare-content h2');
  const description = article.querySelector('.compare-content p');
  const link = article.querySelector('.compare-link');

  leftLabel.textContent = entry.labels?.before ?? 'Früher';
  rightLabel.textContent = entry.labels?.after ?? 'Heute';
  baseImage.src = entry.images.after.src;
  baseImage.alt = entry.images.after.alt;
  overlayImage.src = entry.images.before.src;
  overlayImage.alt = entry.images.before.alt;
  title.textContent = entry.title;
  description.textContent = entry.description;
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openPopUp(entry.popup?.title ?? entry.title, entry.popup?.text ?? '');
  });

  return article;
};

const initializeCompareBlock = (block) => {
  const overlay = block.querySelector('.compare-overlay');
  const handle = block.querySelector('.compare-handle');
  const card = block.closest('.compare-card');
  const valueLabel = card.querySelector('.slider-value');

  const updateSlider = (value) => {
    const normalizedValue = Math.max(0, Math.min(100, Math.round(value)));

    overlay.style.width = `${normalizedValue}%`;
    handle.style.left = `${normalizedValue}%`;
    valueLabel.textContent = `Position: ${normalizedValue}%`;
  };

  const updateFromClientX = (clientX) => {
    const rect = block.getBoundingClientRect();
    const value = ((clientX - rect.left) / rect.width) * 100;

    updateSlider(value);
  };

  updateSlider(50);

  handle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  });

  handle.addEventListener('pointermove', (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) {
      return;
    }

    event.preventDefault();
    updateFromClientX(event.clientX);
  });

  handle.addEventListener('pointerup', (event) => {
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  });

  handle.addEventListener('pointercancel', (event) => {
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  });
};

const renderPage = (data) => {
  const gallery = document.querySelector('[data-gallery]');

  if (!gallery) {
    return;
  }

  gallery.innerHTML = '';
  data.images.forEach((entry) => {
    gallery.append(createCompareCard(entry));
  });

  document.querySelectorAll('[data-compare]').forEach(initializeCompareBlock);
};

const loadPageData = async () => {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Daten konnten nicht geladen werden: ${response.status}`);
    }

    const data = await response.json();
    renderPage(data);
  } catch (error) {
    const gallery = document.querySelector('[data-gallery]');
    gallery.innerHTML = '<p class="load-error">Die Bilddaten konnten nicht geladen werden.</p>';
    console.error(error);
  }
};

if (infoPopUp && popUpClose) {
  popUpClose.addEventListener('click', closePopUp);

  infoPopUp.addEventListener('click', (event) => {
    if (event.target === infoPopUp) {
      closePopUp();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !infoPopUp.hidden) {
      closePopUp();
    }
  });
}

loadPageData();

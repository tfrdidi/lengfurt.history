const infoPopUp = document.querySelector('#info-pop-up');
const infoLinks = document.querySelectorAll('.compare-link[href="#info-pop-up"]');
const popUpClose = infoPopUp.querySelector('.pop-up-close');
const popUpTitle = infoPopUp.querySelector('.pop-up-title');
const popUpText = infoPopUp.querySelector('.pop-up-text');

const openPopUp = (title, text) => {
  popUpTitle.textContent = title;
  popUpText.textContent = text;
  infoPopUp.hidden = false;
  infoPopUp.classList.add('is-open');
  popUpClose.focus();
};

const closePopUp = () => {
  infoPopUp.classList.remove('is-open');
  infoPopUp.hidden = true;
};

infoLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openPopUp(link.dataset.title, link.dataset.infoText);
  });
});

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

const compareBlocks = document.querySelectorAll('[data-compare]');

compareBlocks.forEach((block) => {
  const range = block.querySelector('.compare-range');
  const overlay = block.querySelector('.compare-overlay');
  const handle = block.querySelector('.compare-handle');
  const card = block.closest('.compare-card');
  const valueLabel = card.querySelector('.slider-value');

  const updateSlider = (value) => {
    const normalizedValue = Math.max(0, Math.min(100, Math.round(value)));

    overlay.style.width = `${normalizedValue}%`;
    handle.style.left = `${normalizedValue}%`;
    range.value = normalizedValue;
    valueLabel.textContent = `Position: ${normalizedValue}%`;
  };

  const updateFromClientX = (clientX) => {
    const rect = block.getBoundingClientRect();
    const value = ((clientX - rect.left) / rect.width) * 100;

    updateSlider(value);
  };

  updateSlider(range.value);

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

  range.addEventListener('input', (event) => {
    updateSlider(event.target.value);
  });
});

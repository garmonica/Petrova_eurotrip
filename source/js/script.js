'use strict';

const mainNav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.main-nav__toggle');
mainNav.classList.remove('main-nav--nojs');
menuToggle.addEventListener('click', () => {
  if (mainNav.classList.contains('main-nav--closed')) {
    mainNav.classList.remove('main-nav--closed');
    mainNav.classList.add('main-nav--opened');
  } else {
    mainNav.classList.add('main-nav--closed');
    mainNav.classList.remove('main-nav--opened');
  }
});

const tabs = document.querySelectorAll('.tabs__link');
tabs.forEach((tab) => {
  tab.addEventListener('click', (evt) => {
    evt.preventDefault();
    const tabName = tab.dataset.tab;
    const tabItem = document.querySelector('.countries__item--' + tabName);
    document.querySelector('.countries__item--selected').classList.remove('countries__item--selected');
    tabItem.classList.add('countries__item--selected');
    document.querySelector('.tabs__link--selected').classList.remove('tabs__link--selected');
    tab.classList.add('tabs__link--selected');
  });
});

const placesLinks = document.querySelectorAll('.places__link');
placesLinks.forEach((elem) => {
  elem.addEventListener('click', () => {
    const placeName = elem.dataset.tab;
    const placeItem = document.querySelector('.countries__item--' + placeName);
    document.querySelector('.countries__item--selected').classList.remove('countries__item--selected');
    placeItem.classList.add('countries__item--selected');
    document.querySelector('.tabs__link--selected').classList.remove('tabs__link--selected');
    tabs.forEach((tab) => {
      if (elem.dataset.tab === tab.dataset.tab) {
        tab.classList.add('tabs__link--selected');
      }
    });
  });
});

const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach((link) => {
  link.addEventListener('click', (evt) => {
    evt.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

const tabletWidth = 1023;
if (document.body.clientWidth < tabletWidth) {
  const swipeBlock = document.querySelector('.tabs__list');
  const swipeContainer = document.querySelector('.tabs');
  const swipeContainerLeftMargin = window.getComputedStyle(swipeBlock).getPropertyValue('margin').split(' ')[1].slice(0, -2);
  const swipeContainerSideMargins = parseInt(swipeContainerLeftMargin) * 2;
  let initialPosition = 0;
  let moving = false;
  let transform = 0;
  let transformValue = 0;
  let lastPageX = 0;
  const handleTouchStart = (evt) => {
    initialPosition = evt.touches[0].pageX;
    moving = true;
    const transformMatrix = window.getComputedStyle(swipeBlock).getPropertyValue('transform');
    if (transformMatrix !== 'none') {
      transform = parseInt(transformMatrix.split(',')[4].trim());
    };
  };
  const handleTouchMove = (evt) => {
    if (moving) {
      const currentPosition = evt.touches[0].pageX;
      const diffX = currentPosition - initialPosition;
      transformValue = parseInt(transform) + diffX;
      if (evt.touches[0].pageX - lastPageX > 0) {
        if (transformValue > 0) {
          return;
        }
      } else {
        if (Math.abs(transformValue) > swipeBlock.offsetWidth - swipeContainer.offsetWidth + swipeContainerSideMargins) {
          return;
        }
      }
      swipeBlock.style.transform = `translateX(${transformValue}px)`;
    }
    lastPageX = evt.touches[0].pageX;
  };
  const handleTouchEnd = () => {
    moving = false;
  }
  swipeBlock.addEventListener('touchstart', handleTouchStart, { passive: true });
  swipeBlock.addEventListener('touchmove', handleTouchMove, { passive: true });
  swipeBlock.addEventListener('touchend', handleTouchEnd);
}

const buttonBuy = document.querySelectorAll('.button--buy');
const buttonSubmit = document.querySelectorAll('.button--submit');

const modalBuy = document.querySelector('.modal--buy');
const modalSuccess = document.querySelector('.modal--success');
const modalClose = document.querySelectorAll('.modal__close');

const overlay = document.querySelector('.overlay');

const inputs = document.querySelectorAll('.input');
const inputTel = document.querySelectorAll('.input--tel');
const inputEmail = document.querySelectorAll('.input--email');
const inputError = document.querySelectorAll('.input-wrapper__error');

const openModal = (modalName) => {
  modalName.classList.add('modal--show');
  overlay.classList.add('overlay--add');
}

const closeModal = (modalName) => {
  modalName.classList.remove('modal--show');
  overlay.classList.remove('overlay--add');
}

buttonBuy.forEach((button, i) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    openModal(modalBuy);
    inputTel.forEach((tel) => tel.focus());
  });
});

modalClose.forEach((closebtn) => {
  closebtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    closeModal(modalSuccess);
    closeModal(modalBuy);
  });
});

window.addEventListener('keydown', (evt) => {
  if (evt.key === ('Escape' || 'Esc')) {
    if (modalBuy.classList.contains('modal--show')) {
      evt.preventDefault();
      closeModal(modalBuy);
    }
    if (modalSuccess.classList.contains('modal--show')) {
      evt.preventDefault();
      closeModal(modalSuccess);
    }
  }
});

overlay.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeModal(modalBuy);
  closeModal(modalSuccess);
});

buttonSubmit.forEach((button, i) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (!inputTel[i].value || !inputEmail[i].value) {
      evt.preventDefault();
    } else {
      openModal(modalSuccess);
    }
  });
});

inputTel.forEach((tel) => {
  tel.addEventListener('focus', (evt) => {
    evt.target.value = '+7';
  });
});

inputs.forEach((input, i) => {
  input.addEventListener('input', (evt) => {
    if (input.checkValidity() === false) {
      evt.target.style.borderColor = '#fe7865';
      inputError[i].classList.add('input-wrapper__error--show');
    } else {
      evt.target.style.borderColor = '';
      inputError[i].classList.remove('input-wrapper__error--show');
    }
  });
});

'use strict';

// МЕНЮ:
var mainNav = document.querySelector('.main-nav');
var menuToggle = document.querySelector('.main-nav__toggle');
mainNav.classList.remove('main-nav--nojs');
menuToggle.addEventListener('click', function () {
  if (mainNav.classList.contains('main-nav--closed')) {
    mainNav.classList.remove('main-nav--closed');
    mainNav.classList.add('main-nav--opened');
  } else {
    mainNav.classList.add('main-nav--closed');
    mainNav.classList.remove('main-nav--opened');
  }
});

// ПЕРЕКЛЮЧЕНИЕ ТАБОВ:
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

// ПЕРЕКЛЮЧЕНИЕ ТАБОВ ПРИ КЛИКЕ СМОТРЕТЬ ПОДРОБНЕЕ:
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

// ПЛАВНЫЙ СКРОЛЛ ССЫЛОК-ЯКОРЕЙ:
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

// СВАЙП:

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
    initialPosition = evt.pageX;
    moving = true;
    const transformMatrix = window.getComputedStyle(swipeBlock).getPropertyValue('transform');
    if (transformMatrix !== 'none') {
      transform = parseInt(transformMatrix.split(',')[4].trim());
    };
  };

  const handleTouchMove = (evt) => {
    if (moving) {
      const currentPosition = evt.pageX;
      const diffX = currentPosition - initialPosition;
      transformValue = parseInt(transform) + diffX;
      if (evt.pageX - lastPageX > 0) {
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
    lastPageX = evt.pageX;
  };

  const handleTouchEnd = () => {
    moving = false;
  }

  swipeBlock.addEventListener('pointerdown', handleTouchStart);
  swipeBlock.addEventListener('pointermove', handleTouchMove);
  swipeBlock.addEventListener('pointerup', handleTouchEnd);
}

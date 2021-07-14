'use strict';

// открытие закрытие меню
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

// переключение табов
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

// переключение табов при клике на ссылки раздела Места посещения (выше табов)
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

// плавный скролл
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

// свайп - планшет и мобила
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

// открытие модалок
const buttonBuy = document.querySelectorAll('.button--buy');
const buttonSubmit = document.querySelectorAll('.button--submit');

const modalBuy = document.querySelector('.modal--buy');
const modalSuccess = document.querySelector('.modal--success');
const modalClose = document.querySelectorAll('.modal__close');

const overlay = document.querySelector('.overlay');

const forms = document.querySelectorAll('form');

const inputs = document.querySelectorAll('.input');
const inputTels = document.querySelectorAll('.input--tel');
const inputEmails = document.querySelectorAll('.input--email');

const inputErrors = document.querySelectorAll('.input-wrapper__error');

const openModal = (modalName) => {
  modalName.classList.add('modal--show');
  overlay.classList.add('overlay--add');
}

const closeModal = (modalName) => {
  modalName.classList.remove('modal--show');
  overlay.classList.remove('overlay--add');
}

// открытие модалок по клику оп кнопки Купить тур сейчас
buttonBuy.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    openModal(modalBuy);
    // если поле телефон не заполнено фокус на него
    // иначе если телефон есть, а поле эл.почта не заполнено, фокус на него
    // а если оба заполнены, то фокуса не будет нигде
    for (let i = 0; i < forms.length; i++) {
      if (!inputTels[i].value) {
        inputTels[i].focus();
      } else if (!inputEmails[i].value) {
        inputEmails[i].focus();
      }
    }
  });
});

// закрытие модалок по клику на кнопку-крестик
modalClose.forEach((closebtn) => {
  closebtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    closeModal(modalSuccess);
    closeModal(modalBuy);
  });
});

// закрытие модалок по Esc
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

// закрытие модалок по клику на оверлей
overlay.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeModal(modalBuy);
  closeModal(modalSuccess);
});

// при фокусировке на поле тел. ставим +7, при разфокусировке убираем
inputTels.forEach((tel) => {
  tel.addEventListener('focus', (evt) => {
    if (!tel.value) {
      evt.target.value = '+7';
    }
  });

  tel.addEventListener('blur', (evt) => {
    if (tel.value === '+7') {
      evt.target.value = '';
    }
  });
});

// проверка валидности всех полей, если не валидно показываем сообщение Данные не верны + красная рамка
inputs.forEach((input, i) => {
  input.addEventListener('input', (evt) => {
    if (input.checkValidity() === false) {
      evt.target.style.borderColor = '#fe7865';
      inputErrors[i].classList.add('input-wrapper__error--show');
    } else {
      evt.target.style.borderColor = '';
      inputErrors[i].classList.remove('input-wrapper__error--show');
    }
  });
});

// Local Storage

let isStorageSupport = true;
let storageTel = '';
let storageEmail = '';

try {
  storageTel = localStorage.getItem('tel');
  storageEmail = localStorage.getItem('email');
} catch (err) {
  isStorageSupport = false;
}

if (storageTel || storageEmail) {
  inputTels.forEach(tel => tel.value = storageTel);
  inputEmails.forEach(email => email.value = storageEmail);
}

// форма отправляется, если поле с телефоном заполнено -
// в таком случае записываем значения в Local Storage и показываем модалку об успехе
forms.forEach((form, i) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!inputTels[i].value) {
      evt.preventDefault();
    } else {
      if (isStorageSupport) {
        localStorage.setItem('tel', inputTels[i].value);
        localStorage.setItem('email', inputEmails[i].value);
      }

      openModal(modalSuccess);
    }
  });
})

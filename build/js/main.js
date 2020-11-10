'use strict';

(function() {

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }

})();

(function() {

  if (!Element.prototype.closest) {

    Element.prototype.closest = function(css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }

})();

(function () {

  var linkOrderCall = document.querySelector('.page-header__order-call');
  var sectionOrderCall = document.querySelectorAll('.order-call')[0];
  var sectionOrderDelivered = document.querySelectorAll('.order-call')[1];
  var form = sectionOrderCall.querySelector('form');
  var body = document.querySelector('body');
  var inputName = sectionOrderCall.querySelector('[type="text"]');
  var inputTel = sectionOrderCall.querySelector('[type="tel"]');
  var errorMessageName = sectionOrderCall.querySelectorAll('.order-call span')[0];
  var errorMessageTel = sectionOrderCall.querySelectorAll('.order-call span')[1];

  var isStorageSupport = true;
  var storageTel = "";

  try {
    storageTel = localStorage.getItem('tel');
  } catch (err) {
    isStorageSupport = false;
  }

  function closeModal() {
    if (sectionOrderCall.classList.contains('modal-show')) {
      sectionOrderCall.classList.remove('modal-show');
    }
    if (sectionOrderDelivered.classList.contains('modal-show')) {
      sectionOrderDelivered.classList.remove('modal-show');
    }
    body.classList.remove('body-lock');
  }

  function modalCloseClickHandler(evt) {
    if (!evt.target.closest('form')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.order-call__close')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.order-call__form--delivered [type="submit"]')) {
      evt.preventDefault();
      return closeModal();
    }
    return;
  }

  linkOrderCall.addEventListener('click', function(evt) {
    evt.preventDefault();
    sectionOrderCall.classList.add('modal-show');
    body.classList.add('body-lock');
    if (storageTel) {
      inputName.value = localStorage.getItem('name');
      inputTel.value = localStorage.getItem('tel');
    }
    if (!inputName.value) {
      inputName.classList.add('input-default');
    }
    if (inputName.value) {
      inputName.classList.add('input-valid');
    }
    if (!inputTel.value) {
      inputTel.classList.add('input-default');
    }
    if (inputTel.value) {
      inputTel.classList.add('input-valid');
    }
    inputName.focus();
  });

  sectionOrderCall.addEventListener('click', modalCloseClickHandler);
  sectionOrderDelivered.addEventListener('click', modalCloseClickHandler);

  inputName.addEventListener('blur', function() {
    if (inputName.checkValidity()) {
      inputName.classList.add('input-valid');
    }
    if (inputName.value && !inputName.checkValidity()) {
      inputName.classList.add('input-invalid');
      errorMessageName.classList.add('error-show');
    }
    return;
  })

  inputName.addEventListener('focus', function() {
    if (inputName.classList.contains('input-valid')) {
      inputName.classList.remove('input-valid');
    }
    if (inputName.classList.contains('input-invalid')) {
      inputName.classList.remove('input-invalid');
      errorMessageName.classList.remove('error-show');
    }
    return;
  })

  inputTel.addEventListener('blur', function() {
    if (inputTel.checkValidity()) {
      inputTel.classList.add('input-valid');
    }
    if (inputTel.value && !inputTel.checkValidity()) {
      inputTel.classList.add('input-invalid');
      errorMessageTel.classList.add('error-show');
    }
    return;
  })

  inputTel.addEventListener('focus', function() {
    if (inputTel.classList.contains('input-valid')) {
      inputTel.classList.remove('input-valid');
    }
    if (inputTel.classList.contains('input-invalid')) {
      inputTel.classList.remove('input-invalid');
      errorMessageTel.classList.remove('error-show');
    }
    return;
  })

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (isStorageSupport) {
      localStorage.setItem('name', inputName.value);
      localStorage.setItem('tel', inputTel.value);
    }
    closeModal();
    sectionOrderDelivered.classList.add('modal-show');
    body.classList.add('body-lock');
  });

  window.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' || evt.keyCode === 27) {
      evt.preventDefault();
      if (sectionOrderCall.classList.contains("modal-show")) {
        closeModal();
      }
      if (sectionOrderDelivered.classList.contains("modal-show")) {
        closeModal();
      }
    }
  });

})();

(function() {

  var programsWrap = document.querySelector('.programs__wrap');
  var programsTabs = programsWrap.querySelectorAll('.programs__tabs-list li');
  var programsContents = programsWrap.querySelectorAll('.programs__item');
  var programTabsList = programsWrap.querySelector('.programs__tabs-list');

  var numberActive = 1;
  var numberSwipe = numberActive;
  var mobile;

  for (var i = 0; i < programsContents.length; i++) {
    programsContents[i].classList.add('programs__hide');
  }

  programsTabs[1].classList.add('programs__tab-active');
  programsContents[1].classList.add('programs__show');

  var touchstartX = 0;
  var touchendX = 0;

  function handleGesture(event) {
    if (touchstartX - touchendX >= 60) {
      right();
    }
    if (touchendX - touchstartX >= 60) {
      left();
    }
    if (touchstartX - touchendX === 0) {
      tabsToggleClickHandler(event);
    }
    return;
  }

  function start(event) {
    touchstartX = event.changedTouches[0].screenX;
  }

  function end(event) {
    touchendX = event.changedTouches[0].screenX;
    handleGesture(event);
  }

  function tabsToggleClickHandler(evt) {
    evt.preventDefault();
    if (!evt.target.closest('.programs__tabs-list li')
      ||
      evt.target.closest('.programs__tabs-list li').classList.contains('programs__tab-active')) {
      return;
    }
    programsTabs[numberActive].classList.remove('programs__tab-active');
    programsContents[numberActive].classList.remove('programs__show');
    numberActive = [].indexOf.call(programsTabs, evt.target.closest('.programs__tabs-list li'));
    programsTabs[numberActive].classList.add('programs__tab-active');
    programsContents[numberActive].classList.add('programs__show');
  }

  function right() {
    if (numberSwipe === programsContents.length - 1) {
      return;
    }
    numberSwipe++;
    programTabsList.style.marginLeft = (-180 * numberSwipe + 70) + 'px';
  }

  function left() {
    if (numberSwipe === 0) {
      return;
    }
    numberSwipe--;
    programTabsList.style.marginLeft = (-180 * numberSwipe + 70) + 'px';
  }

  if (window.innerWidth < 768) {
    programTabsList.addEventListener('touchstart', start, false);
    programTabsList.addEventListener('touchend', end, false);
    mobile = true;
  } else {
    programTabsList.addEventListener('click', tabsToggleClickHandler);
    mobile = false;
  }

  window.addEventListener('resize', function () {
    if(window.innerWidth < 768 && !mobile) {
      programTabsList.addEventListener('touchstart', start, false);
      programTabsList.addEventListener('touchend', end, false);
      programTabsList.removeEventListener('click', tabsToggleClickHandler);
      mobile = true;
    }
    if (window.innerWidth < 768 && mobile) {
      return;
    }
    if (window.innerWidth >= 768 && !mobile) {
      return;
    }
    if (window.innerWidth >= 768 && mobile) {
      programTabsList.removeEventListener('touchstart', start, false);
      programTabsList.removeEventListener('touchend', end, false);
      programTabsList.addEventListener('click', tabsToggleClickHandler);
      mobile = false;
      numberSwipe = numberActive;
    }
  }, false);

})();

(function () {

  var sectionOrderDelivered = document.querySelectorAll('.order-call')[1];
  var form = document.querySelector('.desire-trip__form');
  var body = document.querySelector('body');
  var inputTel = form.querySelector('[type="tel"]');
  var errorMessageTel = form.querySelector('span');

  var isStorageSupport = true;
  var storageTel = "";

  try {
    storageTel = localStorage.getItem('tel');
  } catch (err) {
    isStorageSupport = false;
  }

  function closeModal() {

    if (sectionOrderDelivered.classList.contains('modal-show')) {
      sectionOrderDelivered.classList.remove('modal-show');
    }
    body.classList.remove('body-lock');
  }

  function modalCloseClickHandler(evt) {
    if (!evt.target.closest('form')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.order-call__close')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.order-call__form--delivered [type="submit"]')) {
      evt.preventDefault();
      return closeModal();
    }
    return;
  }

  if (storageTel) {
    inputTel.value = localStorage.getItem('tel');
  }
  if (!inputTel.value) {
    inputTel.classList.add('input-default');
  }
  if (inputTel.value) {
    inputTel.classList.add('input-valid');
  }

  sectionOrderDelivered.addEventListener('click', modalCloseClickHandler);

  inputTel.addEventListener('blur', function() {
    if (inputTel.checkValidity()) {
      inputTel.classList.add('input-valid');
    }
    if (inputTel.value && !inputTel.checkValidity()) {
      inputTel.classList.add('input-invalid');
      errorMessageTel.classList.add('error-show');
    }
    return;
  })

  inputTel.addEventListener('focus', function() {
    if (inputTel.classList.contains('input-valid')) {
      inputTel.classList.remove('input-valid');
    }
    if (inputTel.classList.contains('input-invalid')) {
      inputTel.classList.remove('input-invalid');
      errorMessageTel.classList.remove('error-show');
    }
    return;
  })

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (isStorageSupport) {
      localStorage.setItem('tel', inputTel.value);
    }
    closeModal();
    sectionOrderDelivered.classList.add('modal-show');
    body.classList.add('body-lock');
  });

  window.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' || evt.keyCode === 27) {
      evt.preventDefault();

      if (sectionOrderDelivered.classList.contains("modal-show")) {
        closeModal();
      }
    }
  });

})();

(function () {

  var sliderGallery = document.querySelector('.life');
  var imageSlider = sliderGallery.querySelector('.life__pictures');
  var sliderPoints = sliderGallery.querySelectorAll('.life__point');
  var mobile;
  var numberPoint;

  var touchstartX = 0;
  var touchendX = 0;

  function handleGesture() {
    if (touchstartX - touchendX >= 60) {
      right();
    }
    if (touchendX - touchstartX >= 60) {
      left();
    }
    return;
  }

  function start(event) {
    touchstartX = event.changedTouches[0].screenX;
  }

  function end(event) {
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
  }

  function slider() {
    numberPoint = 0;
    sliderPoints[0].classList.add('life__point-active');
    imageSlider.addEventListener('touchstart', start, false);
    imageSlider.addEventListener('touchend', end, false);
  }

  function right() {
    if (numberPoint === sliderPoints.length - 1) {
      return;
    }
    sliderPoints[numberPoint].classList.remove('life__point-active');
    numberPoint++;
    sliderPoints[numberPoint].classList.add('life__point-active');
    imageSlider.style.marginLeft = (-288 * numberPoint) + 'px';
  }

  function left() {
    if (numberPoint === 0) {
      return;
    }
    sliderPoints[numberPoint].classList.remove('life__point-active');
    numberPoint--;
    sliderPoints[numberPoint].classList.add('life__point-active');
    imageSlider.style.marginLeft = (-288 * numberPoint) + 'px';
  }

  if (window.innerWidth < 768) {
    mobile = true;
    slider();
  } else {
    mobile = false;
  }

  window.addEventListener('resize', function (evt) {
    if(window.innerWidth < 768 && !mobile) {
      mobile = true;
      slider();
      return;
    }
    if (window.innerWidth < 768 && mobile) {
      return;
    }
    if (window.innerWidth >= 768 && !mobile) {
      return;
    }
    if (window.innerWidth >= 768 && mobile) {
      mobile = false;
      for (var i = 0; i < sliderPoints.length; i++ ) {
        if (sliderPoints[i].classList.contains('life__point-active')) {
          sliderPoints[i].classList.remove('life__point-active');
        }
      }
      imageSlider.style.marginLeft = '0px';
      imageSlider.removeEventListener('touchstart', start, false);
      imageSlider.removeEventListener('touchend', end, false);
    }
  }, false);

})();

(function () {

  var questionsList =  document.querySelector('.questions__list');

  questionsList.addEventListener('click', function (evt) {
    if (evt.target.closest('.questions__wrap li')) {
      var question = evt.target.closest('.questions__wrap li');
      if (question.querySelector('.questions__wrap-head + p').classList.contains('questions__show')) {
        question.querySelector('.questions__wrap-head + p').classList.remove('questions__show');
        question.querySelector('svg').classList.remove('questions__rotated');
      } else {
        question.querySelector('.questions__wrap-head + p').classList.add('questions__show');
        question.querySelector('svg').classList.add('questions__rotated');
      }
    }
  })

})();

(function () {

  var numberSlide = 3;
  var sectionFeedbacks = document.querySelector('.feedbacks');
  var sliderWrap = sectionFeedbacks.querySelector('.feedbacks__wrap-slider');
  var leftArrow = sectionFeedbacks.querySelector('.feedbacks__left');
  var rightArrow = sectionFeedbacks.querySelector('.feedbacks__right');
  var slides = sectionFeedbacks.querySelectorAll('.feedbacks__slide');
  var sliderCount = sectionFeedbacks.querySelector('.feedbacks__arrows span');
  slides[2].classList.add('feedbacks__show');
  var slideShowed = slides[2];

  function left() {
    if (numberSlide === 1) {
      return;
    } else {
      slideShowed.classList.remove('feedbacks__show');
      numberSlide --;
      slides[numberSlide - 1].classList.add('feedbacks__show');
      slideShowed = slides[numberSlide - 1];
      sliderCount.textContent = numberSlide + ' / 6';
    }
  };

  function right() {
    if (numberSlide === 6) {
      return;
    } else {
      slideShowed.classList.remove('feedbacks__show');
      numberSlide ++;
      slides[numberSlide - 1].classList.add('feedbacks__show');
      slideShowed = slides[numberSlide - 1];
      sliderCount.textContent = numberSlide + ' / 6';
    }
  }

  var touchstartX = 0;
  var touchendX = 0;

  function handleGesture() {
    if (touchstartX - touchendX >= 60) {
      right();
    }
    if (touchendX - touchstartX >= 60) {
      left();
    }
    return;
  }

  leftArrow.addEventListener('click', left);
  rightArrow.addEventListener('click', right);

  sliderWrap.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
  }, false);

  sliderWrap.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
  }, false);

})();

(function () {

  var sectionOrderDelivered = document.querySelectorAll('.order-call')[1];
  var form = document.querySelector('.details__form');
  var body = document.querySelector('body');
  var inputName = form.querySelector('[type="text"]');
  var inputTel = form.querySelector('[type="tel"]');
  var errorMessageName = form.querySelectorAll('span')[0];
  var errorMessageTel = form.querySelectorAll('span')[1];

  var isStorageSupport = true;
  var storageTel = "";

  try {
    storageTel = localStorage.getItem('tel');
  } catch (err) {
    isStorageSupport = false;
  }

  function closeModal() {

    if (sectionOrderDelivered.classList.contains('modal-show')) {
      sectionOrderDelivered.classList.remove('modal-show');
    }
    body.classList.remove('body-lock');
  }

  function modalCloseClickHandler(evt) {
    if (!evt.target.closest('form')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.order-call__close')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.order-call__form--delivered [type="submit"]')) {
      evt.preventDefault();
      return closeModal();
    }
    return;
  }

  if (storageTel) {
    inputName.value = localStorage.getItem('name');
    inputTel.value = localStorage.getItem('tel');
  }
  if (!inputName.value) {
    inputName.classList.add('input-default');
  }
  if (inputName.value) {
    inputName.classList.add('input-valid');
  }
  if (!inputTel.value) {
    inputTel.classList.add('input-default');
  }
  if (inputTel.value) {
    inputTel.classList.add('input-valid');
  }

  sectionOrderDelivered.addEventListener('click', modalCloseClickHandler);

  inputName.addEventListener('blur', function() {
    if (inputName.checkValidity()) {
      inputName.classList.add('input-valid');
    }
    if (inputName.value && !inputName.checkValidity()) {
      inputName.classList.add('input-invalid');
      errorMessageName.classList.add('error-show');
    }
    return;
  })

  inputName.addEventListener('focus', function() {
    if (inputName.classList.contains('input-valid')) {
      inputName.classList.remove('input-valid');
    }
    if (inputName.classList.contains('input-invalid')) {
      inputName.classList.remove('input-invalid');
      errorMessageName.classList.remove('error-show');
    }
    return;
  })

  inputTel.addEventListener('blur', function() {
    if (inputTel.checkValidity()) {
      inputTel.classList.add('input-valid');
    }
    if (inputTel.value && !inputTel.checkValidity()) {
      inputTel.classList.add('input-invalid');
      errorMessageTel.classList.add('error-show');
    }
    return;
  })

  inputTel.addEventListener('focus', function() {
    if (inputTel.classList.contains('input-valid')) {
      inputTel.classList.remove('input-valid');
    }
    if (inputTel.classList.contains('input-invalid')) {
      inputTel.classList.remove('input-invalid');
      errorMessageTel.classList.remove('error-show');
    }
    return;
  })

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (isStorageSupport) {
      localStorage.setItem('name', inputName.value);
      localStorage.setItem('tel', inputTel.value);
    }
    closeModal();
    sectionOrderDelivered.classList.add('modal-show');
    body.classList.add('body-lock');
  });

  window.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' || evt.keyCode === 27) {
      evt.preventDefault();

      if (sectionOrderDelivered.classList.contains("modal-show")) {
        closeModal();
      }
    }
  });

})();

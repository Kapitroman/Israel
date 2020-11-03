'use strict';

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
  /*
  errorMessageName.classList.add('error-hide');
  errorMessageTel.classList.add('error-hide');
  */
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
    if (evt.key === 'Escape') {
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
  var programsTabs = Array.from(programsWrap.querySelectorAll('.programs__tabs-list li'));
  var programsContents = Array.from(programsWrap.querySelectorAll('.programs__item'));
  var programTabsList = programsWrap.querySelector('.programs__tabs-list');

  var numberActive = 1;

  for (var i = 0; i < programsContents.length; i++) {
    programsContents[i].classList.add('programs__hide');
  }

  programsTabs[1].classList.add('programs__tab-active');
  programsContents[1].classList.add('programs__show');

  function tabsToggleClickHandler(evt) {
    evt.preventDefault();
    if (!evt.target.closest('.programs__tabs-list li')
      ||
      evt.target.closest('.programs__tabs-list li').classList.contains('programs__tab-active')) {
      return;
    }
    programsTabs[numberActive].classList.remove('programs__tab-active');
    programsContents[numberActive].classList.remove('programs__show');
    numberActive = programsTabs.indexOf(evt.target.closest('.programs__tabs-list li'));
    programsTabs[numberActive].classList.add('programs__tab-active');
    programsContents[numberActive].classList.add('programs__show');
  }

  programTabsList.addEventListener('click', tabsToggleClickHandler);

})();

(function () {
  //var linkOrderCall = document.querySelector('.page-header__order-call');
  //var sectionOrderCall = document.querySelectorAll('.order-call')[0];
  var sectionOrderDelivered = document.querySelectorAll('.order-call')[1];
  var form = document.querySelector('.desire-trip__form');
  var body = document.querySelector('body');
  //var inputName = sectionOrderCall.querySelector('[type="text"]');
  var inputTel = form.querySelector('[type="tel"]');
  //var errorMessageName = sectionOrderCall.querySelectorAll('.order-call span')[0];
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
    if (evt.key === 'Escape') {
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
  var sliderController = sliderGallery.querySelector('.life__controller');
  var sliderPoints = Array.from(sliderGallery.querySelectorAll('.life__point'));
  var mobile;

  if (window.innerWidth < 768) {
    mobile = true;
    slider();
  } else {
    mobile = false;
  }

  window.addEventListener('resize', function (evt) {
    if(evt.target.innerWidth < 768 && !mobile) {
      mobile = true;
      slider();
      return;
    }
    if (evt.target.innerWidth < 768 && mobile) {
      return;
    }
    if (evt.target.innerWidth >= 768 && !mobile) {
      return;
    }
    if (evt.target.innerWidth >= 768 && mobile) {
      mobile = false;
      for (var i = 0; i < sliderPoints.length; i++ ) {
        if (sliderPoints[i].classList.contains('life__point-active')) {
          sliderPoints[i].classList.remove('life__point-active');
        }
      }
      imageSlider.style.marginLeft = '0px';
      sliderController.removeEventListener('click', clickOnPointHandler);
    }
  }, false);



  function slider() {

    var numberPoint = 0;
    sliderPoints[0].classList.add('life__point-active');
    //var activePoint = sliderPoints[0];

    function clickOnPointHandler(evt) {
      var point = evt.target;
      if (!point.classList.contains('life__point') || point.classList.contains('life__point-active')) {
        return;
      }
      else {
        for (var i = 0; i < sliderPoints.length; i++ ) {
          if (sliderPoints[i].classList.contains('life__point-active')) {
            sliderPoints[i].classList.remove('life__point-active');
          }
        }
        //activePoint.classList.remove('life__point-active');
        numberPoint = sliderPoints.indexOf(point);
        point.classList.add('life__point-active');
        //activePoint = point;
        imageSlider.style.marginLeft = (-288 * numberPoint) + 'px';
      }
    }

    sliderController.addEventListener('click', clickOnPointHandler);
  }

})();

(function () {

  var questionsList =  document.querySelector('.questions__list');

  questionsList.addEventListener('click', function (evt) {
    if (evt.target.closest('.questions__wrap li')) {
      var question = evt.target.closest('.questions__wrap li');
      if (question.querySelector('p').classList.contains('questions__show')) {
        question.querySelector('p').classList.remove('questions__show');
        question.querySelector('svg').classList.remove('questions__rotated');
      } else {
        question.querySelector('p').classList.add('questions__show');
        question.querySelector('svg').classList.add('questions__rotated');
      }
    }
  })

})();

(function () {

  var numberSlide = 3;
  var sectionFeedbacks = document.querySelector('.feedbacks');
  var leftArrow = sectionFeedbacks.querySelector('.feedbacks__left');
  var rightArrow = sectionFeedbacks.querySelector('.feedbacks__right');
  var slides = sectionFeedbacks.querySelectorAll('.feedbacks__slide');
  var sliderCount = sectionFeedbacks.querySelector('.feedbacks__arrows span');
  slides[2].classList.add('feedbacks__show');
  var slideShowed = slides[2];

  leftArrow.addEventListener('click', function () {
    if (numberSlide === 1) {
      return;
    } else {
      slideShowed.classList.remove('feedbacks__show');
      numberSlide --;
      slides[numberSlide - 1].classList.add('feedbacks__show');
      slideShowed = slides[numberSlide - 1];
      sliderCount.textContent = numberSlide + ' / 6';
    }
  });

  rightArrow.addEventListener('click', function () {
    if (numberSlide === 6) {
      return;
    } else {
      slideShowed.classList.remove('feedbacks__show');
      numberSlide ++;
      slides[numberSlide - 1].classList.add('feedbacks__show');
      slideShowed = slides[numberSlide - 1];
      sliderCount.textContent = numberSlide + ' / 6';
    }
  });

})();

(function () {
  //var linkOrderCall = document.querySelector('.page-header__order-call');
  //var sectionOrderCall = document.querySelectorAll('.order-call')[0];
  var sectionOrderDelivered = document.querySelectorAll('.order-call')[1];
  var form = document.querySelector('.details__form');
  var body = document.querySelector('body');
  //var inputName = sectionOrderCall.querySelector('[type="text"]');
  var inputName = form.querySelector('[type="text"]');
  var inputTel = form.querySelector('[type="tel"]');
  //var errorMessageName = sectionOrderCall.querySelectorAll('.order-call span')[0];
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
    if (evt.key === 'Escape') {
      evt.preventDefault();

      if (sectionOrderDelivered.classList.contains("modal-show")) {
        closeModal();
      }
    }
  });

})();


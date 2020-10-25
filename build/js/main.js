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
  var storageName = "";

  try {
    storageName = localStorage.getItem('name');
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
    if (storageName) {
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

  errorMessageName.classList.add('error-hide');
  errorMessageTel.classList.add('error-hide');

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

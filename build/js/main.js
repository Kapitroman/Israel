'use strict';

(function() {
  /**
 * Object.assign() polyfill
 */
Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(a,b){"use strict";if(void 0===a||null===a)error("Cannot convert first argument to object");for(var c=Object(a),d=1;d<arguments.length;d++){var e=arguments[d];if(void 0!==e&&null!==e)for(var f=Object.keys(Object(e)),g=0,h=f.length;g<h;g++){var i=f[g],j=Object.getOwnPropertyDescriptor(e,i);void 0!==j&&j.enumerable&&(c[i]=e[i])}}return c}});

/**
 * CustomEvent() polyfill
 */
!function(){if("function"==typeof window.CustomEvent)return;function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n}t.prototype=window.Event.prototype,window.CustomEvent=t}();


/**
 * Функция определения события swipe на элементе.
 * @param {Object} el - элемент DOM.
 * @param {Object} settings - объект с предварительными настройками.
 */
window.swipe = function(el, settings) {

    var settings = Object.assign({}, {
        minDist: 60,
        maxDist: 120,
        maxTime: 700,
        minTime: 50
    }, settings);

    if (settings.maxTime < settings.minTime) settings.maxTime = settings.minTime + 500;
    if (settings.maxTime < 100 || settings.minTime < 50) {
        settings.maxTime = 700;
        settings.minTime = 50;
    }

    var dir,
        swipeType,
        dist,
        isMouse = false,
        isMouseDown = false,
        startX = 0,
        distX = 0,
        startY = 0,
        distY = 0,
        startTime = 0,
        support = {
            pointer: !!("PointerEvent" in window || ("msPointerEnabled" in window.navigator)),
            touch: !!(typeof window.orientation !== "undefined" || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || "ontouchstart" in window || navigator.msMaxTouchPoints || "maxTouchPoints" in window.navigator > 1 || "msMaxTouchPoints" in window.navigator > 1)
        };

    /**
     * Опредление доступных в браузере событий: pointer, touch и mouse.
     * @returns {Object} - возвращает объект с доступными событиями.
     */
    var getSupportedEvents = function() {
        switch (true) {
            case support.pointer:
                events = {
                    type:   "pointer",
                    start:  "PointerDown",
                    move:   "PointerMove",
                    end:    "PointerUp",
                    cancel: "PointerCancel",
                    leave:  "PointerLeave"
                };
                var ie10 = (window.navigator.msPointerEnabled && Function('/*@cc_on return document.documentMode===10@*/')());
                for (var value in events) {
                    if (value === "type") continue;
                    events[value] = (ie10) ? "MS" + events[value] : events[value].toLowerCase();
                }
                break;
            case support.touch:
                events = {
                    type:   "touch",
                    start:  "touchstart",
                    move:   "touchmove",
                    end:    "touchend",
                    cancel: "touchcancel"
                };
                break;
            default:
                events = {
                    type:  "mouse",
                    start: "mousedown",
                    move:  "mousemove",
                    end:   "mouseup",
                    leave: "mouseleave"
                };
                break;
        }
        return events;
    };


    /**
     * Объединение событий mouse/pointer и touch.
     * @param e {Event} - принимает в качестве аргумента событие.
     * @returns {TouchList|Event} - возвращает либо TouchList, либо оставляет событие без изменения.
     */
    var eventsUnify = function(e) {
        return e.changedTouches ? e.changedTouches[0] : e;
    };


    /**
     * Обрабочик начала касания указателем.
     * @param e {Event} - получает событие.
     */
    var checkStart = function(e) {
        var event = eventsUnify(e);
        if (support.touch && typeof e.touches !== "undefined" && e.touches.length !== 1) return; // игнорирование касания несколькими пальцами
        dir = "none";
        swipeType = "none";
        dist = 0;
        startX = event.pageX;
        startY = event.pageY;
        startTime = new Date().getTime();
        if (isMouse) isMouseDown = true;
    };

    /**
     * Обработчик движения указателя.
     * @param e {Event} - получает событие.
     */
    var checkMove = function(e) {
        if (isMouse && !isMouseDown) return;
        var event = eventsUnify(e);
        distX = event.pageX - startX;
        distY = event.pageY - startY;
        if (Math.abs(distX) > Math.abs(distY)) dir = (distX < 0) ? "left" : "right";
        else dir = (distY < 0) ? "up" : "down";
    };

    /**
     * Обработчик окончания касания указателем.
     * @param e {Event} - получает событие.
     */
    var checkEnd = function(e) {
        if (isMouse && !isMouseDown) {
            isMouseDown = false;
            return;
        }
        var endTime = new Date().getTime();
        var time = endTime - startTime;
        if (time >= settings.minTime && time <= settings.maxTime) {
            if (Math.abs(distX) >= settings.minDist && Math.abs(distY) <= settings.maxDist) {
                swipeType = dir;
            } else if (Math.abs(distY) >= settings.minDist && Math.abs(distX) <= settings.maxDist) {
                swipeType = dir;
            }
        }
        dist = (dir === "left" || dir === "right") ? Math.abs(distX) : Math.abs(distY);

        if (swipeType !== "none" && dist >= settings.minDist) {
            var swipeEvent = new CustomEvent("swipe", {
                bubbles: true,
                cancelable: true,
                detail: {
                    full: e,
                    dir:  swipeType,
                    dist: dist,
                    time: time
                }
            });
            el.dispatchEvent(swipeEvent);
        }
    };

    var events = getSupportedEvents();

    if ((support.pointer && !support.touch) || events.type === "mouse") isMouse = true;

    el.addEventListener(events.start, checkStart);
    el.addEventListener(events.move, checkMove);
    el.addEventListener(events.end, checkEnd);
    if(support.pointer && support.touch) {
        el.addEventListener('lostpointercapture', checkEnd);
    }
};

})();


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
  var mobile;

  for (var i = 0; i < programsContents.length; i++) {
    programsContents[i].classList.add('programs__hide');
  }

  programsTabs[1].classList.add('programs__tab-active');
  programsContents[1].classList.add('programs__show');

  window.swipe(programTabsList, { maxTime: 1000, minTime: 100, maxDist: 150,  minDist: 60 });

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

  function tabsToggleSwipeHandler(evt) {
    evt.preventDefault();
    if (evt.detail.dir === "left") {
      if (numberActive === programsContents.length - 1) {
        return;
      }
      programsTabs[numberActive].classList.remove('programs__tab-active');
      programsContents[numberActive].classList.remove('programs__show');
      numberActive++;
      programsTabs[numberActive].classList.add('programs__tab-active');
      programsContents[numberActive].classList.add('programs__show');
      programTabsList.style.marginLeft = (-180 * numberActive + 70) + 'px';
    }
    if (evt.detail.dir === "right") {
      if (numberActive === 0) {
        return;
      }
      programsTabs[numberActive].classList.remove('programs__tab-active');
      programsContents[numberActive].classList.remove('programs__show');
      numberActive--;
      programsTabs[numberActive].classList.add('programs__tab-active');
      programsContents[numberActive].classList.add('programs__show');
      programTabsList.style.marginLeft = (-180 * numberActive + 70) + 'px';
    }
    return;
  }

  if (window.innerWidth < 768) {
    programTabsList.addEventListener('swipe', tabsToggleSwipeHandler);
    mobile = true;
  } else {
    programTabsList.addEventListener('click', tabsToggleClickHandler);
    mobile = false;
  }

  window.addEventListener('resize', function () {
    if(window.innerWidth < 768 && !mobile) {
      programTabsList.addEventListener('swipe', tabsToggleSwipeHandler);
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
      programTabsList.removeEventListener('swipe', tabsToggleSwipeHandler);
      programTabsList.addEventListener('click', tabsToggleClickHandler);
      mobile = false;
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

  window.swipe(imageSlider, { maxTime: 1000, minTime: 100, maxDist: 150,  minDist: 60 });

  if (window.innerWidth < 768) {
    mobile = true;
    slider();
  } else {
    mobile = false;
  }

  function swipeSliderHandler(evt) {
    if (evt.detail.dir === "left") {
      if (numberPoint === sliderPoints.length - 1) {
        return;
      }
      sliderPoints[numberPoint].classList.remove('life__point-active');
      numberPoint++;
      sliderPoints[numberPoint].classList.add('life__point-active');
      imageSlider.style.marginLeft = (-288 * numberPoint) + 'px';
    }
    if (evt.detail.dir === "right") {
      if (numberPoint === 0) {
        return;
      }
      sliderPoints[numberPoint].classList.remove('life__point-active');
      numberPoint--;
      sliderPoints[numberPoint].classList.add('life__point-active');
      imageSlider.style.marginLeft = (-288 * numberPoint) + 'px';
    }
    return;
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
      imageSlider.removeEventListener('swipe', swipeSliderHandler);
    }
  }, false);

  function slider() {
    numberPoint = 0;
    sliderPoints[0].classList.add('life__point-active');
    imageSlider.addEventListener('swipe', swipeSliderHandler);
  }

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

  window.swipe(sliderWrap, { maxTime: 1000, minTime: 100, maxDist: 150,  minDist: 60 });

  leftArrow.addEventListener('click', left);
  rightArrow.addEventListener('click', right);

  sliderWrap.addEventListener("swipe", function(evt) {
    if (evt.detail.dir === "left") {
      right();
    }
    if (evt.detail.dir === "right") {
      left();
    }
    return;
  });

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

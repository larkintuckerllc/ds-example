(function() {
  'use strict';
  var thr0w = window.thr0w;
  var loginEl = document.getElementById('login');
  var controlEl = document.getElementById('control');
  var controlFloatEl = document.getElementById('control-float');
  document.addEventListener('DOMContentLoaded', ready);
  // thr0w.setBase('http://localhost'); // DEV
  thr0w.setBase('http://192.168.1.2'); // PROD
  if (thr0w.authenticated()) {
    controlEl.style.display = 'block';
    controlFloatEl.style.display = 'block';
  } else {
    loginEl.style.display = 'block';
  }
  function ready() {
    document.getElementById('login__form')
      .addEventListener('submit', handleLoginFormSubmit);
    document.getElementById('control__logout')
      .addEventListener('click', handleControlLogoutClick);
    document.getElementById('control-float__button--prev')
      .addEventListener('click', handleControlFloatButtonPrev);
    document.getElementById('control-float__button--next')
      .addEventListener('click', handleControlFloatButtonNext);
    function handleLoginFormSubmit(e) {
      e.preventDefault();
      var loginFormPasswordEl =
        document.getElementById('login__form__password');
      var username =
        document.getElementById('login__form__username').value;
      var password = loginFormPasswordEl.value;
      if (username && password) {
        thr0w.login(username, password, handleLogin);
      }
      function handleLogin(error) {
        if (!error) {
          loginEl.style.display = 'none';
          controlEl.style.display = 'block';
          controlFloatEl.style.display = 'block';
        } else {
          loginFormPasswordEl.value = '';
        }
      }
    }
    function handleControlLogoutClick() {
      thr0w.logout();
      window.location.reload();
    }
    function handleControlFloatButtonPrev() {
      thr0w.thr0w([0], {action: 'prev'});
    }
    function handleControlFloatButtonNext() {
      thr0w.thr0w([0], {action: 'next'});
    }
  }
})();

(function() {
  'use strict';
  var thr0w = window.thr0w;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var base = window.location.protocol + '//' +
      window.location.hostname;
    thr0w.setBase(base);
    thr0w.addLoginTools(document.body, loginCallback);
    function loginCallback() {
      document.getElementById('authorized__logout')
        .addEventListener('click', handleauthorizedLogoutClick);
      document.getElementById('authorized-float__button--prev')
        .addEventListener('click', handleauthorizedFloatButtonPrev);
      document.getElementById('authorized-float__button--next')
        .addEventListener('click', handleauthorizedFloatButtonNext);
      document.getElementById('authorized').style.display = 'block';
      document.getElementById('authorized-float').style.display = 'block';
      function handleauthorizedLogoutClick() {
        thr0w.logout();
      }
      function handleauthorizedFloatButtonPrev() {
        thr0w.thr0w([0], {action: 'prev'});
      }
      function handleauthorizedFloatButtonNext() {
        thr0w.thr0w([0], {action: 'next'});
      }
    }
  }
})();

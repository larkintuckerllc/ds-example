(function() {
  'use strict';
  var thr0w = window.thr0w;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var base = window.location.protocol + '//' +
      window.location.hostname;
    thr0w.setBase(base);
    thr0w.addLoginTools(document.body, handleThr0wLogin);
    function handleThr0wLogin() {
      document.getElementById('restart').addEventListener('click',
        handleRestartClick);
      document.getElementById('logout').addEventListener('click',
        thr0w.logout);
      document.getElementById('authorized').style.display = 'block';
      function handleRestartClick() {
        thr0w.thr0w([10], {
          action: 'update',
          url: base + '/kiosk.html'
        });
      }
    }
  }
})();

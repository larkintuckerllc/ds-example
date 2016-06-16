(function() {
  'use strict';
  var UPLOAD_URL = '/larkintuckerllc-ds-example-upload/';
  var thr0w = window.thr0w;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var frameEl = document.getElementById('my_frame');
    // TODO: FIX THIS AND INDEX
    thr0w.setBase('http://localhost'); // DEV
    // thr0w.setBase('http://192.168.1.2'); // PROD
    thr0w.addAdminTools(frameEl,
      connectCallback, messageCallback);
    function connectCallback() {
      // TRY READING AN UPLOADED CONFIGURATION FILE
      var contentEl = document.getElementById('my_content');
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = handleOnreadystatechange;
      xmlhttp.open('GET', UPLOAD_URL + 'config.json', true);
      xmlhttp.send();
      function handleOnreadystatechange() {
        var config;
        var pdf;
        var pdfUrl;
        if (xmlhttp.readyState !== 4) {
          return;
        }
        if (xmlhttp.status === 200) {
          config = JSON.parse(xmlhttp.responseText);
        } else {
          // DEFAULT VALUES
          config = {
            interval: 5,
            portrait: false,
            uploadedPdf: false
          };
        }
        pdfUrl = config.uploadedPdf ? UPLOAD_URL + 'example.pdf' :
          'example.pdf';
        if (config.portrait) {
          frameEl.style.width = '1080px';
          frameEl.style.height = '1920px';
          contentEl.style.width = '1080px';
          contentEl.style.height = '1920px';
        }
        var grid = new thr0w.Grid(
          frameEl,
          document.getElementById('my_content'),
          [[0]]
        );
        pdf = new thr0w.pdf.Pdf(
          grid,
          document.getElementById('my_content__carousel'),
          pdfUrl
        );
        pdf.addEventListener('ready', pdfReady);
        function pdfReady() {
          var currentPage = 1;
          var numPages = pdf.getNumPages();
          if (numPages > 1) {
            window.setInterval(cycle, config.interval * 1000);
          }
          function cycle() {
            if (currentPage < numPages) {
              ++currentPage;
              pdf.openNextPage();
            } else {
              currentPage = 1;
              pdf.openPage(1);
            }
          }
        }
      }
    }
    function messageCallback() {
    }
  }
})();

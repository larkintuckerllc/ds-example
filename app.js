(function() {
  'use strict';
  var USER = 'larkintuckerllc';
  var REPO = 'ds-example';
  var CONFIG_FILENAME = 'config.json';
  var PDF_FILENAME = 'example.pdf';
  var ds = window.ds;
  var thr0w = window.thr0w;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var frameEl = document.getElementById('my_frame');
    // thr0w.setBase('http://localhost'); // DEV
    thr0w.setBase('http://192.168.1.2'); // PROD
    thr0w.addAdminTools(frameEl,
      connectCallback, messageCallback);
    function connectCallback() {
      var contentEl = document.getElementById('my_content');
      // ds.setBase('http://localhost', USER, REPO); // DEV
      ds.setBase('http://192.168.1.2', USER, REPO); // PROD
      ds.downloadObject(CONFIG_FILENAME, handleDownloadObject);
      function handleDownloadObject(downloadObjectErr, config) {
        var grid;
        var pdf;
        var pdfUrl;
        if (downloadObjectErr && downloadObjectErr !== 404) {
          return;
        }
        if (downloadObjectErr) {
          config = {
            interval: 5,
            portrait: true,
            uploadedPdf: false
          };
        }
        if (config.portrait) {
          frameEl.style.width = '1080px';
          frameEl.style.height = '1920px';
          contentEl.style.width = '1080px';
          contentEl.style.height = '1920px';
        }
        pdfUrl = config.uploadedPdf ?
          '/upload/' + USER + '-' + REPO + '/' + PDF_FILENAME :
          PDF_FILENAME;
        grid = new thr0w.Grid(
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

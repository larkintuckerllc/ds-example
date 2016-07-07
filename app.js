(function() {
  'use strict';
  // var BASE = 'http://localhost'; // DEV
  var BASE = 'http://192.168.1.2'; // PROD
  var USER = 'larkintuckerllc';
  var REPO = 'ds-example';
  var CONFIG_FILENAME = 'config.json';
  var PDF_FILENAME = 'example.pdf';
  var ds = window.ds;
  var thr0w = window.thr0w;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var currentPage = 1;
    var numPages;
    var pdf;
    var loaded = false;
    var frameEl = document.getElementById('my_frame');
    thr0w.setBase(BASE);
    thr0w.addAdminTools(frameEl,
      connectCallback, messageCallback);
    function connectCallback() {
      var contentEl = document.getElementById('my_content');
      ds.setBase(BASE);
      ds.setRepo(USER, REPO);
      ds.downloadObject(CONFIG_FILENAME, handleDownloadObject);
      function handleDownloadObject(downloadObjectErr, config) {
        var grid;
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
          loaded = true;
          numPages = pdf.getNumPages();
          if (numPages > 1) {
            window.setInterval(cycleNext, config.interval * 1000);
          }
        }
      }
    }
    function messageCallback(data) {
      var action = data.message.action;
      if (!loaded) {
        return;
      }
      if (action === undefined) {
        return;
      }
      if (action === 'prev') {
        cyclePrev();
      } else if (action === 'next') {
        cycleNext();
      }
    }
    function cycleNext() {
      if (currentPage < numPages) {
        ++currentPage;
        pdf.openNextPage();
      } else {
        currentPage = 1;
        pdf.openPage(1);
      }
    }
    function cyclePrev() {
      if (currentPage > 1) {
        --currentPage;
        pdf.openPrevPage();
      } else {
        currentPage = numPages;
        pdf.openPage(numPages);
      }
    }
  }
})();

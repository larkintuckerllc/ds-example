(function() {
  'use strict';
  var CONFIG_FILENAME = 'config.json';
  var ds = window.ds;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    ds.setBase('http://localhost', 'larkintuckerllc', 'ds-prototype'); // DEV
    ds.addAdminTools(document.body,loginCallback);
    function loginCallback() {
      ds.downloadObject(CONFIG_FILENAME, handleDownloadObject);
      function handleDownloadObject(downloadObjectErr, config) {
        if (downloadObjectErr && downloadObjectErr !== 404) {
          return;
        }
        var authorizedEl = document.getElementById('authorized');
        var configEl = document.getElementById('config');
        var intervalEl = document.getElementById('config__interval');
        var logoutEl = document.getElementById('logout');
        var pdfEl = document.getElementById('pdf');
        var deleteEl = document.getElementById('delete');
        var pdfFileEl = document.getElementById('pdf__file');
        var portraitEl = document.getElementById('config__portrait');
        if (downloadObjectErr) {
          config = {
            interval: 5,
            portrait: false,
            uploadedPdf: false
          };
        }
        if (config.uploadedPdf) {
          pdfEl.style.display = 'none';
          deleteEl.style.display = 'block';
        }
        intervalEl.value = config.interval;
        portraitEl.checked = config.portrait;
        configEl.addEventListener('submit', handleConfigSubmit);
        pdfEl.addEventListener('submit', handlePdfSubmit);
        deleteEl.addEventListener('click', handleDelete);
        logoutEl.addEventListener('click', logout);
        authorizedEl.style.display = 'block';
        function handleConfigSubmit(e) {
          e.preventDefault();
          config.interval = intervalEl.value;
          config.portrait = portraitEl.checked;
          ds.uploadObject(config, CONFIG_FILENAME, handleUploadObject);
          function handleUploadObject(error) {
            // TODO: HANDLE ERROR
            if (error) {
              return;
            }
          }
        }
        function handlePdfSubmit(e) {
          e.preventDefault();
          if (!pdfFileEl.files.length) {
            return;
          }
          if (pdfFileEl.files[0].name !== 'example.pdf') {
            // TODO: HANDLE ERROR
            return;
          }
          ds.uploadFile(pdfFileEl.files[0], handleUploadFile);
          function handleUploadFile(error) {
            // TODO: HANDLE ERROR
            if (error) {
              return;
            }
            pdfFileEl.value = null;
            config.uploadedPdf = true;
            ds.uploadObject(config, CONFIG_FILENAME, handleUploadObject);
            function handleUploadObject(error) {
              // TODO: HANDLE ERROR
              if (error) {
                return;
              }
              pdfEl.style.display = 'none';
              deleteEl.style.display = 'block';
            }
          }
        }
        function handleDelete() {
          ds.remove('example.pdf', handleRemove);
          function handleRemove(error) {
            // TODO: HANDLE ERROR
            if (error) {
              return;
            }
            config.uploadedPdf = false;
            ds.uploadObject(config, CONFIG_FILENAME, handleUploadObject);
            function handleUploadObject(error) {
              // TODO: HANDLE ERROR
              if (error) {
                return;
              }
            }
            pdfEl.style.display = 'block';
            deleteEl.style.display = 'none';
          }
        }
        function logout() {
          ds.logout();
        }
      }
    }
  }
})();

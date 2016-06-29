(function() {
  'use strict';
  var CONFIG_FILENAME = 'config.json';
  var PDF_FILENAME = 'example.pdf';
  var USER = 'larkintuckerllc';
  var REPO = 'ds-example';
  var PDF_REGEX = /\.pdf$/i;
  var ds = window.ds;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    // ds.setBase('http://localhost', USER, REPO); // DEV
    ds.setBase('http://192.168.1.2', USER, REPO); // PROD
    ds.addAdminTools(document.body,loginCallback);
    function loginCallback() {
      ds.downloadObject(CONFIG_FILENAME, handleDownloadObject);
      function handleDownloadObject(downloadObjectErr, config) {
        if (downloadObjectErr && downloadObjectErr !== 404) {
          return;
        }
        var authorizedEl = document.getElementById('authorized');
        var authorizedConfigEl = document.getElementById('authorized__config');
        var authorizedConfigIntervalEl =
          document.getElementById('authorized__config__interval');
        var authorizdConfigPortraitEl =
          document.getElementById('authorized__config__portrait');
        var authorizedConfigFailedEl =
          document.getElementById('authorized__config__failed');
        var authorizedPdfFilenameEl =
          document.getElementById('authorized__pdf-filename');
        var authorizedPdfFailedEl =
          document.getElementById('authorized__pdf-failed');
        var authorizedPdfBrowseEl =
          document.getElementById('authorized__pdf-browse');
        var authorizedPdfBrowseFileEl =
          document.getElementById('authorized__pdf-browse__file');
        var authorizedPdfDeleteEl =
          document.getElementById('authorized__pdf-delete');
        var authorizedPdfDeleteDeleteEl =
          document.getElementById('authorized__pdf-delete__delete');
        var authorizedLogoutEl = document.getElementById('authorized__logout');
        if (downloadObjectErr) {
          config = {
            interval: 5,
            portrait: true,
            uploadedPdf: false
          };
        }
        if (config.uploadedPdf) {
          authorizedPdfBrowseEl.style.display = 'none';
          authorizedPdfDeleteEl.style.display = 'block';
        }
        authorizedConfigIntervalEl.value = config.interval;
        authorizdConfigPortraitEl.checked = config.portrait;
        authorizedConfigEl.addEventListener('submit',
          handleAuthorizedConfigSubmit);
        authorizedPdfBrowseFileEl
          .addEventListener('change', handleAuthorizedPdfBrowseFileChange);
        authorizedPdfDeleteDeleteEl.addEventListener('click',
          handleAuthorizedPdfDeleteDeleteClick);
        authorizedLogoutEl.addEventListener('click',
          ds.logout);
        authorizedEl.style.display = 'block';
        function handleAuthorizedConfigSubmit(e) {
          e.preventDefault();
          config.interval = authorizedConfigIntervalEl.value;
          config.portrait = authorizdConfigPortraitEl.checked;
          ds.uploadObject(config, CONFIG_FILENAME, handleUploadObject);
          function handleUploadObject(error) {
            if (error !== null) {
              authorizedConfigFailedEl.style.display = 'block';
              return;
            }
            authorizedConfigFailedEl.style.display = 'none';
          }
        }
        function handleAuthorizedPdfBrowseFileChange() {
          var file = authorizedPdfBrowseFileEl.files[0];
          if (!PDF_REGEX.test(file.name)) {
            authorizedPdfFailedEl.style.display = 'none';
            authorizedPdfFilenameEl.style.display = 'block';
            return;
          }
          authorizedPdfFilenameEl.style.display = 'none';
          ds.uploadFile(file, handleUploadFile, PDF_FILENAME);
          function handleUploadFile(error) {
            authorizedPdfBrowseFileEl.value = null;
            if (error !== null) {
              authorizedPdfFailedEl.style.display = 'block';
              return;
            }
            config.uploadedPdf = true;
            ds.uploadObject(config, CONFIG_FILENAME, handleUploadObject);
            function handleUploadObject(error) {
              if (error !== null) {
                authorizedPdfFailedEl.style.display = 'block';
                return;
              }
              authorizedPdfFailedEl.style.display = 'none';
              authorizedPdfBrowseEl.style.display = 'none';
              authorizedPdfDeleteEl.style.display = 'block';
            }
          }
        }
        function handleAuthorizedPdfDeleteDeleteClick() {
          ds.remove(PDF_FILENAME, handleRemove);
          function handleRemove(error) {
            if (error !== null) {
              authorizedPdfFailedEl.style.display = 'block';
              return;
            }
            config.uploadedPdf = false;
            ds.uploadObject(config, CONFIG_FILENAME, handleUploadObject);
            function handleUploadObject(error) {
              if (error !== null) {
                authorizedPdfFailedEl.style.display = 'block';
                return;
              }
              authorizedPdfFailedEl.style.display = 'none';
              authorizedPdfDeleteEl.style.display = 'none';
              authorizedPdfBrowseEl.style.display = 'block';
            }
          }
        }
      }
    }
  }
})();

(function() {
  'use strict';
  // var BASE = 'http://localhost'; // DEV
  var BASE = 'http://192.168.1.2'; // PROD
  var CONFIG_FILENAME = 'config.json';
  var PDF_FILENAME = 'example.pdf';
  var USER = 'larkintuckerllc';
  var REPO = 'ds-example';
  var PDF_REGEX = /\.pdf$/i;
  var thr0w = window.thr0w;
  var ds = window.ds;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    thr0w.setBase(BASE);
    ds.setBase(BASE);
    ds.setRepo(USER, REPO);
    if (window.localStorage.getItem('logout')) {
      window.localStorage.removeItem('logout');
      thr0w.logout();
    }
    thr0w.addLoginTools(document.body, handleThr0wLogin);
    function handleThr0wLogin() {
      var thr0wToken = thr0w.getToken();
      ds.loginToken(thr0wToken, handleLoginToken);
      function handleLoginToken(loginTokenErr) {
        if (loginTokenErr !== null) {
          return ds.addAdminTools(document.body, handleDsLogin);
        }
        handleDsLogin();
        function handleDsLogin() {
          ds.downloadObject(CONFIG_FILENAME, handleDownloadObject);
          function handleDownloadObject(downloadObjectErr, config) {
            if (downloadObjectErr && downloadObjectErr !== 404) {
              return;
            }
            var authorizedEl = document.getElementById('authorized');
            var authorizedConfigEl = document
              .getElementById('authorized__config');
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
            var authorizedLogoutEl = document
              .getElementById('authorized__logout');
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
                reload();
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
                  reload();
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
                  reload();
                }
              }
            }
            function reload() {
              thr0w.thr0w([10], {
                action: 'update',
                url: BASE + '/kiosk.html'
              });
            }
          }
        }
      }
    }
  }
})();

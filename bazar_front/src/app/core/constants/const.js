export const URL_REGEX = /^(http|https|ftp):\/\/[^\s/$.?#].[^\s]*$/;
export const DURATION_REGEX = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
export const ROLES = { ADMIN: 'ADMIN', USER: 'USER', MOD: 'MOD' };

var _global =
  typeof window === 'object' && window.window === window
    ? window
    : typeof self === 'object' && self.self === self
      ? self
      : typeof global === 'object' && global.global === global
        ? global
        : this;

var isMacOSWebView =
  _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent);

function click(node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}

export var saveAs =
  // probably in some web worker
  typeof window !== 'object' || window !== _global
    ? function saveAs() {
        /* noop */
      }
    : // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
      'download' in HTMLAnchorElement.prototype && !isMacOSWebView
      ? function saveAs(blob, name, opts) {
          var URL = _global.URL || _global.webkitURL;
          var a = document.createElement('a');
          name = name || blob.name || 'download';

          a.download = name;
          a.rel = 'noopener'; // tabnabbing

          // TODO: detect chrome extensions & packaged apps
          // a.target = '_blank'

          if (typeof blob === 'string') {
            // Support regular links
            a.href = blob;
            if (a.origin !== location.origin) {
              corsEnabled(a.href) ? download(blob, name, opts) : click(a, (a.target = '_blank'));
            } else {
              click(a);
            }
          } else {
            // Support blobs
            a.href = URL.createObjectURL(blob);
            setTimeout(function () {
              URL.revokeObjectURL(a.href);
            }, 4e4); // 40s
            setTimeout(function () {
              click(a);
            }, 0);
          }
        }
      : // Use msSaveOrOpenBlob as a second approach
        'msSaveOrOpenBlob' in navigator
        ? function saveAs(blob, name, opts) {
            name = name || blob.name || 'download';

            if (typeof blob === 'string') {
              if (corsEnabled(blob)) {
                download(blob, name, opts);
              } else {
                var a = document.createElement('a');
                a.href = blob;
                a.target = '_blank';
                setTimeout(function () {
                  click(a);
                });
              }
            } else {
              navigator.msSaveOrOpenBlob(bom(blob, opts), name);
            }
          }
        : // Fallback to using FileReader and a popup
          function saveAs(blob, name, opts, popup) {
            // Open a popup immediately do go around popup blocker
            // Mostly only available on user interaction and the fileReader is async so...
            popup = popup || open('', '_blank');
            if (popup) {
              popup.document.title = popup.document.body.innerText = 'downloading...';
            }

            if (typeof blob === 'string') return download(blob, name, opts);

            var force = blob.type === 'application/octet-stream';
            var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;
            var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

            if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
              // Safari doesn't allow downloading of blob URLs
              var reader = new FileReader();
              reader.onloadend = function () {
                var url = reader.result;
                url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
                if (popup) popup.location.href = url;
                else location = url;
                popup = null; // reverse-tabnabbing #460
              };
              reader.readAsDataURL(blob);
            } else {
              var URL = _global.URL || _global.webkitURL;
              var url = URL.createObjectURL(blob);
              if (popup) popup.location = url;
              else location.href = url;
              popup = null; // reverse-tabnabbing #460
              setTimeout(function () {
                URL.revokeObjectURL(url);
              }, 4e4); // 40s
            }
          };

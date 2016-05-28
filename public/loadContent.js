'use strict';

(function() {
  var pageCont = document.getElementById('pageCont');
  window.loadPageContent = function(page) {
    // check for dataset support, check for data-page definition; if they're available, don't load if not necessary:
    if (pageCont.dataset && pageCont.dataset.page && pageCont.dataset.page === page) return;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var newCont;
        var newPage;
        if (xhr.status !== 200) {
          newCont = xhr.statusText;
          newPage = '';
        } else {
          newCont = xhr.responseText;
          newPage = page;
        }
        if (pageCont.dataset) pageCont.dataset.page = newPage;
        pageCont.style.opacity = '0';
        // wait for the animation:
        setTimeout(function() {
          pageCont.innerHTML = newCont;
          var scripts = Array.prototype.slice.call(pageCont.getElementsByTagName('script'), 0);
          for (var i = 0, len = scripts.length; i < len; i ++) {
            if (scripts[i].src !== '' || scripts[i].innerHTML !== '') {
              var src = scripts[i].src;
              var html = scripts[i].innerHTML;
              var parent = scripts[i].parentNode;
              var script = document.createElement('script');
              if (src) {
                script.src = src;
              } else if (html) {
                script.innerHTML = html;
              }
              parent.insertBefore(script, scripts[i]);
              parent.removeChild(scripts[i]);
            }
          }
          pageCont.style.opacity = '1';
        }, 300);
      }
    }
    xhr.open('GET', '/pages/' + page + '.html');
    xhr.send();
  }

  var isHandle = false;
  var arr = document.body.className.split(' ');
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === 'menu-handle') {
      isHandle = true;
      break;
    }
  }

  window.onhashchange = function() {
    var hash = window.location.hash.substr(1);
    if (hash === '') return; // empty or '#'
    window.loadPageContent(hash);
  }
})();

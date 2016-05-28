'use strict';

(function () {
  window.originalPageTitle = document.title;
  var pageNav = document.getElementById('pageNav');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        pageNav.innerHTML = 'Could not fetch menu (try again).';
        return;
      }
      var nav = document.createElement('nav');
      var menu = JSON.parse(xhr.responseText);
      var keys = Object.keys(menu);
      for (var i = 0, len = keys.length; i < len; i++) {
        (function(i) {
          var child = document.createElement('a');
          child.onclick = function() {
            if (window.onmenuitemclick) window.onmenuitemclick();
          }
          child.innerHTML = keys[i];
          child.href = menu[keys[i]];
          nav.appendChild(child);
        })(i);
      }
      pageNav.appendChild(nav);
    }
  }
  xhr.open('GET', '/menu.json');
  xhr.send();
  var i = 0;
  var pageNav = document.getElementById('pageNav');
  var overlay = document.getElementById('overlay');
  var handle = document.getElementById('handle');
  function show() {
    pageNav.style.left = '0';
    overlay.style.visibility = 'visible';
    overlay.className = 'opaq';
    i = 1;
  }
  function hide() {
    pageNav.style.left = '-100%';
    overlay.className = '';
    overlay.style.visibility = 'hidden';
    i = 0;
  }
  handle.onclick = function() {
    if (i === 0) {
      show();
    } else if (i === 1) {
      hide();
    }
  }
  var prop;
  try {
    // modern
    prop = window.getComputedStyle(handle).display;
  } catch(e) {
    // <=IE8
    prop = handle.currentStyle.display;
  }
  if (prop !== 'none') {
    var arr = document.body.className.split(' ');
    if (arr[0] === '') arr.shift();
    arr.push('menu-handle');
    document.body.className = arr.join(' ');
  }
  window.onmenuitemclick = hide;
  overlay.onclick = hide;
})();

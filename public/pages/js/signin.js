'use strict';

(function() {
  var overlay = document.getElementById('signin_overlay');
  var popup = document.getElementById('popup');
  var info_elm = document.getElementById('popup_info');
  var ok = document.getElementById('popup_ok');
  var chatButton = document.getElementById('chat');
  var username = document.getElementById('username');
  ok.onclick = function() {
    popup.classList.remove('simple--popup-shown');
    overlay.classList.remove('simple--overlay-shown');
  }
  function showPopup(info) {
    info_elm.innerHTML = info;
    overlay.classList.add('simple--overlay-shown');
    popup.classList.add('simple--popup-shown');
  }
  chatButton.onclick = function() {
    var sentUsername = username.value;
    if (sentUsername === '') return showPopup('Username can\'t be empty');
    window.portal.once('respondUsername', function(valid, msg) {
      if (!valid) return showPopup(msg || 'Unknown error');
      window.portalId = sentUsername;
      window.location.hash = '#chat';
    });
    window.portal.emit('requestUsername', sentUsername);
  }
})();

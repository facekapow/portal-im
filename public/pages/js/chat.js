'use strict';

(function() {
  // decodeUnicode() from http://stackoverflow.com/a/14681146
  // used to count unicode characters as a single character for string length.
  function decodeUnicode(str) {
	  var r = [], i = 0;
	  while (i < str.length) {
		  var chr = str.charCodeAt(i++);
		  if (chr >= 0xD800 && chr <= 0xDBFF) {
			  // surrogate pair
			  var low = str.charCodeAt(i++);
			  r.push(0x10000 + ((chr - 0xD800) << 10) | (low - 0xDC00));
      } else {
			  // ordinary character
			  r.push(chr);
		  }
	  }
	  return r;
  }

  var input = document.getElementById('chat_input');
  var send = document.getElementById('chat_send');
  var overlay = document.getElementById('chat_overlay');
  var popup = document.getElementById('popup');
  var info_elm = document.getElementById('popup_info');
  var ok = document.getElementById('popup_ok');
  ok.onclick = function() {
    popup.classList.remove('simple--popup-shown');
    overlay.classList.remove('simple--overlay-shown');
  }
  overlay.onclick = function() {
    popup.classList.remove('simple--popup-shown');
    overlay.classList.remove('simple--overlay-shown');
  }
  function showPopup(info, cb) {
    overlay.onclick = ok.onclick = function() {
      popup.classList.remove('simple--popup-shown');
      overlay.classList.remove('simple--overlay-shown');
      cb();
      overlay.onclick = ok.onclick = function() {
        popup.classList.remove('simple--popup-shown');
        overlay.classList.remove('simple--overlay-shown');
      }
    }
    info_elm.innerHTML = info;
    overlay.classList.add('simple--overlay-shown');
    popup.classList.add('simple--popup-shown');
  }
  function makeNode(username, text) {
    var node = document.createElement('div');
    var username_elm = document.createElement('span');
    var text_elm = document.createElement('span');
    node.className = 'chat_node';
    username_elm.className = 'chat_username';
    text_elm.className = 'chat_text';
    username_elm.innerHTML = username;
    text_elm.innerHTML = text;
    node.appendChild(username_elm);
    node.appendChild(text_elm);
    return node;
  }
  var chat = document.getElementById('chat_feed');
  function addNode(node) {
    chat.appendChild(node);
    setTimeout(function() {
      // opacity transition doesn't work if we don't wait
      node.classList.add('chat_node_shown');
      chat.scrollTop = chat.scrollHeight;
    }, 10);
  }
  function removeIfTooLong() {
    if (chat.children.length > 60) chat.removeChild(chat.firstChild);
  }
  // for debugging only:
  /* window.makeNode = makeNode;
  window.addNode = addNode;
  addNode(makeNode('tutorial', 'Hello, world!'));
  setTimeout(function() {
    addNode(makeNode('tutorial', 'Hi there, and welcome!'));
  }, 2000); */
  // end debugging only
  portal.on('message', function(username, msg) {
    addNode(makeNode(username, msg));
    removeIfTooLong();
  });
  portal.on('clearChat', function() {
    chat.innerHTML = '';
  });
  portal.on('severConnections', function(msg) {
    portal.close();
    window.portalId = null;
    var info = 'You\'ve been disconnected from the server';
    if (msg) info += ' (' + msg + ')';
    showPopup(info, function() {
      window.location.hash = '#index';
    });
  });
  input.onkeydown = function(e) {
    if (e.keyCode === 13) {
      // enter
      send.click();
    }
  }
  send.onclick = function() {
    var val = input.value;
    if (val === '') return;
    if (decodeUnicode(val).length > 200) return showPopup('Message too long! (max 200 characters)');
    portal.emit('emitMessage', val);
    addNode(makeNode(window.portalId, clean(val)));
    removeIfTooLong();
    input.value = '';
  }
  portal.once('respondLatestMessages', function(msgs) {
    for (var i = 0, len = msgs.length; i < len; i++) addNode(makeNode(msgs[i].username, msgs[i].msg));
  });
  portal.emit('requestLatestMessages');
  input.focus();
})();

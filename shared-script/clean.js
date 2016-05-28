'use strict';

(function(cb) {
  if (typeof window === 'undefined' && typeof require !== 'undefined') {
    module.exports = cb();
  } else {
    window.clean = cb();
  }
})(function() {
  var exports = {};
  var words = [
    'fuck',
    'shit',
    'ass',
    'hoe',
    'mofo',
    'whore',
    'slut',
    'skank',
    'bitch',
    'cunt',
    'penis',
    'dick',
    'vagina'
  ];
  var arr = [];
  for (var i = 0, len = words.length; i < len; i++) arr.push(words[i].split('').join('+') + '+');
  var badWordsRegex = new RegExp('(' + arr.join('|') + ')', 'gi');
  exports = function clean(msg) {
    return msg.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\*\*([^\*]+)\*\*/g, '<em>$1</em>')
              .replace(/\\\*([^\*]+)\*/g, '<strong>$1</strong>')
              .replace(/__([^_]+)__/g, '<em>$1</em>')
              .replace(/\\_([^_]+)_/g, '<strong>$1</strong>')
              .replace(/~~([^~]+)~~/g, '<del>$1</del>')
              .replace(/\\!((?:#[0-9A-F]{6})|(?:#[0-9A-F]{3})|(?:[A-Z]+)) ([^!]+)!/gi, '<span style="color: $1;">$2</span>')
              .replace(/\\!bg-((?:#[0-9A-F]{6})|(?:#[0-9A-F]{3})|(?:[A-Z]+)) ([^!]+)!/gi, '<span style="background-color: $1;">$2</span>')
              .replace(badWordsRegex, function(match) {
                var censors = [];
                for (var i = 0, len = match.length-1; i < len; i++) censors.push('<span class="chat_sensored"></span>');
                return match.substr(0, 1) + censors.join('');
              });
  }
  return exports;
});

'use strict';

const internalHandle = Symbol('handle');
const privateGet = Symbol('privateGet');

class PowerObject {
  constructor(obj) {
    this[internalHandle] = [];
    if (obj) for (let key of Object.keys(obj)) this.set(key, obj[key]);
  }
  [privateGet](obj) {
    for (let i = 0, len = this[internalHandle].length; i < len; i++) {
      const evenOrOdd = String(i).substr(-1);
      if (evenOrOdd === '0' || evenOrOdd === '2' || evenOrOdd === '4' || evenOrOdd === '6' || evenOrOdd === '8') {
        // key
        if (this[internalHandle][i] === obj) return i;
      }
    }
    return null;
  }
  get(obj) {
    let key = this[privateGet](obj);
    if (key === null) return undefined;
    key++;
    return this[internalHandle][key];
  }
  set(obj, val) {
    let key = this[privateGet](obj);
    if (key === null) {
      this[internalHandle].push(obj);
      this[internalHandle].push(val);
    } else {
      key++;
      this[internalHandle][key] = val;
    }
  }
  remove(obj) {
    const key = this[privateGet](obj);
    if (key === null) return;
    this[internalHandle].splice(key, 2);
  }
  keys() {
    const ret = [];
    for (let i = 0, len = this[internalHandle].length; i < len; i++) {
      const evenOrOdd = String(i).substr(-1);
      if (evenOrOdd === '0' || evenOrOdd === '2' || evenOrOdd === '4' || evenOrOdd === '6' || evenOrOdd === '8') {
        // key
        ret.push(this[internalHandle][i]);
      }
    }
    return ret;
  }
  [Symbol.iterator]() {
    let i = 1;
    return {
      next: () => {
        if (i >= this[internalHandle].length) return {done: true};
        const val = this[internalHandle][i];
        i += 2; // skip keys
        return {value: val, done: false};
      }
    }
  }
}

module.exports = PowerObject;

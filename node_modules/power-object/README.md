# power-object
An object with superpowers!

## Superpower report
  * Use objects as keys:
    ```js
    const PowerObject = require('power-object');
    let obj = new PowerObject();

    // objects are always different
    let key1 = {};
    let key2 = {};
    let key3 = new Date(); // even classes (which are technically just objects)

    obj.set(key1, 400);
    obj.set(key2, 500);
    obj.set(key3, 'hi');
    obj.set(3, 'hello'); // numbers aren't stringified

    obj.get(key1); // 400
    obj.get(key2); // 500
    obj.get(key3); // 'hi'
    obj.get(3); // 'hello'
    ```
  * `for...of` iteration:
    ```js
    const PowerObject = require('power-object');
    let obj = new PowerObject();

    let key1 = {};
    let key2 = {};

    obj.set(key1, 'some value');
    obj.set(key2, 89);

    for (let value of obj) console.log(value); // 'some value' then 89
    ```

## Class docs

### new PowerObject([object])
Returns a new PowerObject, optionally creating it from a given object.
Unlike a regular object, you can't get or set a property directly (using `obj[prop]` or `obj.prop`).

#### PowerObject.prototype.get(key)
Retrieves a value from the PowerObject given a key. Unlike a regular Object, this can include Objects and doesn't stringify anything.

#### PowerObject.prototype.set(key, val)
Sets a value on the PowerObject for a given key. Unlike a regular Object, this can include Objects and doesn't stringify anything.

#### PowerObject.prototype.keys()
Returns an array containing the PowerObject's keys.

#### PowerObject.prototype.remove(key)
Removes a property from the PowerObject. Unlike a regular Object, this can include Objects and doesn't stringify anything.

#### PowerObject.prototype[Symbol.iterator]
Returns an Iterator to iterate over the PowerObject's properties. Used by `for...of` to iterate.

# 实现 catulate 方法

```js
function catulate(num) {
  // let res = num;
  // let fn = function() {
  //   return res;
  // };
  // fn.toString = function() {
  //   return res;
  // };
  // fn.plus = function(a) {
  //   res += a;
  //   return fn;
  // };
  // fn.reduce = function(a) {
  //   res -= a;
  //   return fn;
  // };
  // return fn;
  function gen(init) {
    this.value = init;
    this.plus = function(a) {
      this.value += a;
      return this;
    };
    this.reduce = function(a) {
      this.value -= a;
      return this;
    };
  }
  const obj = new gen(num);
  Object.defineProperty(obj, 'valueOf', {
    get() {
      return obj.value;
    }
  });
  Object.defineProperty(obj, 'toString', {
    get() {
      return obj.value;
    }
  });
  return obj;
}
catulate(5)
  .plus(3)
  .reduce(2);

catulate(5)
  .plus(3)
  .reduce(2) + 3;
```

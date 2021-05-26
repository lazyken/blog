# 实现 call、apply、bind 方法

## call

```js
Function.prototype.myCall = function(thisArg) {
  if (typeof this !== 'function') {
    throw new Error('not a function');
  }
  thisArg = thisArg || window;
  thisArg.originFn = this;
  const args = [...arguments].slice(1);
  return thisArg.originFn(...args);
};
var obj = {
  name: 'obj'
};
function foo(first, second) {
  console.log(this.name);
  console.log(first, second);
  console.log(arguments);
}
foo.myCall(obj, 1, 2);
```

## apply

```js
Function.prototype.myApply = function(thisArg) {
  if (typeof this !== 'function') {
    throw new Error('not a function');
  }
  thisArg = thisArg || window;
  thisArg.originFn = this;
  const args = arguments[1] ? arguments[1].slice() : undefined;
  return args ? thisArg.originFn(...args) : thisArg.originFn();
};
var obj = {
  name: 'obj'
};
function foo(first, second) {
  console.log(this.name);
  console.log(first, second);
  console.log(arguments);
}
foo.myApply(obj, [1, 2, 3]);
```

## bind

```js
Function.prototype.myBind = function(thisArg) {
  if (typeof this !== 'function') {
    throw new Error('not a function');
  }
  thisArg = thisArg || window;
  thisArg.originFn = this;
  const args = [...arguments].slice(1);
  return function F() {
    if (this instanceof F) {
      return new thisArg.originFn(...args, ...arguments);
    }
    return thisArg.originFn(...args, ...arguments);
  };
};

function foo(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  console.log(this.name);
  console.log(arguments);
}
var obj = {
  name: 'obj'
};
var bindFunc = foo.myBind(obj, 'AAA', 'BBB');
bindFunc('CCC');
var instance = new bindFunc('DDD');
console.log(instance);
```

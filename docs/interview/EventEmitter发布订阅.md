# EventEmitter

大多数的实现其实就是发布订阅的基础库。下面手写一个简单的发布订阅：

```js
class MyEventEmitter {
  constructor() {
    this.eventMap = {};
  }

  on(type, handler) {
    if (!this.eventMap[type]) {
      this.eventMap[type] = [];
    }
    this.eventMap[type].push(handler);
  }

  emit(type, params) {
    if (this.eventMap[type]) {
      this.eventMap[type].forEach((handler, index) => {
        handler(params);
      });
    }
  }

  off(type, handler) {
    if (this.eventMap[type]) {
      const targetIndex = this.eventMap[type].indexof(handler);
      this.eventMap[type].splice(targetIndex, 1);
    }
  }
}
```

```js
function MyEventEmitter() {
  this.eventmap = {};
}
MyEventEmitter.prototype.on = function(type, handler) {
  if (!handler instanceof Function) {
    throw new Error('callback handler should be a function');
  }
  if (!this.eventMap[type]) {
    this.eventMap[type] = [];
  }
  this.eventMap[type].push(handler);
};

MyEventEmitter.prototype.emit = function(type, params) {
  if (this.eventMap[type]) {
    this.eventMap[type].forEach((handler, index) => {
      handler(params);
    });
  }
};

MyEventEmitter.prototype.off = function(type, handler) {
  if (this.eventMap[type]) {
    const targetIndex = this.eventMap[type].indexof(handler);
    this.eventMap[type].splice(targetIndex, 1);
  }
};
```

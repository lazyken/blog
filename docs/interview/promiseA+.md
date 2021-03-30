# promiseA+

[promiseA+规范](https://promisesaplus.com/)

```js
// https://promisesaplus.com/
// promise有三种状态
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    // 当前Promise实例的状态，初始状态为PENDING
    this.status = PENDING;
    // 保存resolve时传入的值
    this.value = undefined;
    // 保存reject时传入的值
    this.reason = undefined;
    // 如果executor是异步的，将then接受的回调函数保存起来，异步结束的时候再执行
    this.onResolvedCallBacks = [];
    this.onRejectedCallBacks = [];
    // resolve修改promise实例为成功状态
    let resolve = value => {
      // promise状态一旦改变就不能再修改了，所以只有在PENDING时resolve才有效
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
        // 在then方法内订阅，保存回调函数；resolve时发布，执行回调函数
        this.onResolvedCallBacks.forEach(cb => cb());
      }
    };
    // reject修改promise实例为失败状态
    let reject = reason => {
      // promise状态一旦改变就不能再修改了，所以只有在PENDING时reject才有效
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 在then方法内订阅，保存回调函数；reject时发布，执行回调函数
        this.onRejectedCallBacks.forEach(cb => cb());
      }
    };
    // executor内部代码可能会报错，所以用try catch
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onResolved, onRejected) {
    // onResolved和onRejected是可选参数,这里定义默认回调函数
    // 比如 p = new Promise()    p.then().then()
    onResolved = typeof onResolved === 'function' ? onResolved : val => val;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : err => {
            throw err;
          };
    // 在then方法中new一个promise实例并返回，实现then的链式调用，即then返回的始终是一个promise实例
    let nextPromise = new Promise((resolve, reject) => {
      // 调用then方法时判断promise实例的状态

      // 如果executor内已经resolve了
      if (this.status === RESOLVED) {
        // 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
        // 由于new Promise在结束后才能赋值给变量nextPromise，因此使用setTimeout，保证processPromise能传入nextPromise
        // 自己无法实现微任务，所以这里使用setTimeout
        setTimeout(() => {
          // onResolved是用户传入的回调，执行时可能会报错，使用try catch
          try {
            let data = onResolved(this.value);
            // then的链式调用：将当前 onResolved回调 的结果传给nextPromise，processPromise做了一些判断和处理
            processPromise(nextPromise, data, resolve, reject);
          } catch (error) {
            // onResolved执行出错，直接reject出去
            reject(error);
          }
        }, 0);
      }
      // 如果executor内已经reject了
      else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let data = onRejected(this.reason);
            processPromise(nextPromise, data, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      // 如果executor是异步的，调用then时状态还是PENDING，则把回调函数先存起来，等异步结束后再执行回调函数
      else if (this.status === PENDING) {
        // 订阅回调函数
        this.onResolvedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let data = onResolved(this.value);
              processPromise(nextPromise, data, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let data = onRejected(this.reason);
              processPromise(nextPromise, data, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return nextPromise;
  }

  finally(cb) {
    return this.then(
      data => {
        return Promise.resolve(cb()).then(() => data);
      },
      err => {
        return Promise.resolve(cb()).then(() => {
          throw err;
        });
      }
    );
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

function processPromise(nextPromise, data, resolve, reject) {
  // 根据A+规范

  // case1、如果nextPromise和data是同一个值，则reject
  // 比如：
  // let p = new Promise((resolve, reject) => {
  //   resolve(100);
  // });
  // let p2 = p.then((data) => {
  //   return p2
  // });
  // 也就是说then最终会返回nextPromise，当onRejected或者onResolved也返回了nextPromise本身时，
  // 就会造成链式循环引用，无法继续往下走
  if (nextPromise === data) {
    reject(new TypeError('Chaining cycle detected for promise #<Promise>]'));
  }
  // case2、如果data是一个object或者function
  if ((typeof data === 'object' && data !== null) || typeof data === 'function') {
    // 判断data是否具有then方法，如果有就可以认为data是一个promise

    // case6:
    // data是用户传入的promise，它可能是一个标准的promise，也可能没有严格遵守Promise的规范
    // 未遵循规范时，当data里多次调用resolve或reject时，只执行第一个，忽略之后的
    // 因此使用called作为标记来判断
    let called = false;

    try {
      // 如果访问then属性时报错，则reject
      // 比如当data的then属性被Object.defineProperties改写了getter方法抛出错误
      let then = data.then;
      // case4、如果then是一个function，则认为data是一个promise
      if (typeof then === 'function') {
        // 防止再次取then时可能发生报错，这里用第一次取的then的call方法
        // data是一个promise，它可能会处于三种状态：
        // 1）pending时，则必须等待，直到data的状态变为resolved（fulfilled）或者rejected。（这里是什么都不做）
        // 2）resolved（fulfilled）时，调用data的then方法，在onResolved回调里将value再resolve出去
        // 3）rejected时，调用data的then方法，在onRejected回调里将value再reject出去
        then.call(
          data,
          y => {
            if (called) return;
            called = true;
            // data里resolve出的y，可能仍然是一个promise，则递归处理，直到data是一个普通值，即走到case3
            processPromise(nextPromise, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // case5、data不具有then属性；data的then属性不是function，data是非promise对象；直接resolve
        if (called) return;
        called = true;
        resolve(data);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // case3、data是常量
    resolve(data);
  }
}

Promise.resolve = function(value) {
  if (value instanceof Promise) {
    return value;
  } else {
    return new Promise((resolve, reject) => {
      // value是Error实例时，还是resolve出去，此时传递的是Error实例对象本身，并不是执行出错
      resolve(value);
    });
  }
};

Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

Promise.all = function(arr) {
  return new Promise((resolve, reject) => {
    let result = [];
    let count = 0;
    function _procressData(index, data) {
      result[index] = data;
      count++;
      if (count === arr.length) {
        resolve(result);
      }
    }
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i]).then(data => {
        _procressData(i, data);
      }, reject);
    }
  });
};

Promise.race = function(arr) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i]).then(
        data => {
          resolve(data);
        },
        err => {
          reject(err);
        }
      );
    }
  });
};
// 用于跑 promiseA+ 的测试
Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
```

<!-- > 代码根据珠峰的姜文老师公开课进行整理 -->

# Scheduler 类

```js
class Scheduler {
  running = 0;
  taskQueue = [];

  async add(promiseFunc) {
    return new Promise(resolve => {
      this.taskQueue.push({
        task: promiseFunc,
        resolveFunc: resolve
      });
      this.run();
    });
  }

  run() {
    if (this.running < 2) {
      let taskObj = this.taskQueue.shift();
      this.running++;
      taskObj.task().then(() => {
        this.running--;
        taskObj.resolveFunc();
        if (this.taskQueue.length) {
          this.run();
        }
      });
    }
  }
}

const scheduler = new Scheduler();

const timeout = time => {
  return new Promise(r => setTimeout(r, time));
};

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4); // log:2 3 1 4
```

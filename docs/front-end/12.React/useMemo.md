# useMemo

先举个例子：

```js
import React, { useState, useMemo } from 'react';

export default function Demo() {
  const [times, setTimes] = useState(1000);
  const sum = useMemo(
    function computeSum() {
      let sum = 0;
      for (let i = 0; i < times; i++) {
        sum += i;
      }
      return sum;
    },
    [times]
  );
  return <div>{sum}</div>;
}
```

这是一个简单的求和 Demo，它的工作流程如下：

1. 调用 setTimes 更新 times
2. Demo 组件重新渲染
3. 在渲染过程中，useMemo 会比较依赖项 times 是否改变，如果改变会重新走一遍 computeSum 计算 sum。如果依赖项 times 没有改变（与之前的值相等），则不会再 sum 的值。在例子中即省略了再次计算 1000 次的计算。

如果对比 VUE 的话，可以认为相当于 computed 的作用。

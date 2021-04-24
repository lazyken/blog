# 比较版本号

> 版本号规范： {major}.{minor}.{patch}-{alpha | beta | rc}.{number}  
> 版本号示例：1.3.2 1.3.2-alpha 1.3.2-rc.1  
> 1.3.2 < 1.3.3  
> 1.3.2-alpha < 1.3.2-beta < 1.3.2-rc  
> 1.3.2-rc < 1.3.2-rc.1 < 1.3.2  
> v1 > v2 返回 1  
> v1 = v2 返回 0  
> v1 < v2 返回 -1

```js
const VERSION_REGEXP = /(\d{1,})\.(\d{1,})\.(\d{1,})-?(alpha|beta|rc)?\.?(\d{1,})?/;
const PreRelease = {
  alpha: 1,
  beta: 2,
  rc: 3
};
// 比较函数
const compare = (v1, v2, isPre) => {
  if (!v1 && v2) {
    return isPre ? -1 : 1;
  } else if (v1 && !v2) {
    return isPre ? 1 : -1;
  }

  if (v1 > v2) {
    return 1;
  } else if (v1 < v2) {
    return -1;
  }
  return 0;
};

const compareVersion = (v1, v2) => {
  if (v1 === v2) {
    return 0;
  }
  // 通过正则解析提取 major minor path 等信息
  const v1Match = v1.match(VERSION_REGEXP);
  const v2Match = v2.match(VERSION_REGEXP);
  // 使用最长的数组元素遍历
  const len = Math.max(v1Match.length, v2Match.length);
  for (let i = 1; i < len; i++) {
    // 对索引为 4 的 alpha beta rc 做特殊处理
    // 同时对先行版本号的 number 进行特殊判断
    const result = i === 4 ? compare(PreRelease[v1Match[i]], PreRelease[v2Match[i]]) : compare(v1Match[i], v2Match[i], i > 4);
    // 当 判断结果不为 0 时直接返回
    if (result !== 0) {
      return result;
    }
  }
  return 0;
};

console.log('0', compareVersion('1.3.2', '1.3.2'));
console.log('-1', compareVersion('1.0.0', '1.3.2'));
console.log('1', compareVersion('2.0.0', '1.3.2'));
console.log('-1', compareVersion('1.3.2', '1.3.3'));
console.log('1', compareVersion('1.3.2', '1.3.2-alpha'));
console.log('-1', compareVersion('1.3.2-alpha', '1.3.2-beta'));
console.log('-1', compareVersion('1.3.2-beta', '1.3.2-rc'));
console.log('-1', compareVersion('1.3.2-rc', '1.3.2-rc.1'));
console.log('-1', compareVersion('1.3.2-rc.1', '1.3.2'));
```

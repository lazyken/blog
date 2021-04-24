# 实现 trim 方法

```js
function myTrim(str) {
  const reg = /^\s*|\s*$/g;
  return str.replace(reg, '');
}
myTrim('    123  123    '); // 123  123
```

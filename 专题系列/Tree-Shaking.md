# tree shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

关于 tree-shaking 的原理，及早期版本可能会存在的问题/坑，推荐阅读以下文章来了解：

1. [你的 Tree-Shaking 并没什么卵用](https://github.com/wuomzfx/tree-shaking-test)
2. [Tree-Shaking 性能优化实践 - 原理篇](https://juejin.cn/post/6844903544756109319)
3. [Tree Shaking](https://www.webpackjs.com/guides/tree-shaking/)

## webpack4 之前

关于 tree-shaking 需要了解的关键点：

### Tree-Shaking 的原理

1. 使用 ES6 的模块语法，ES6 的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码。
2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码。

### 副作用导致早期版本可能删除不掉未使用的模块代码

- 副作用大致可以理解成：一个函数会、或者可能会对函数外部变量产生影响的行为。
- 使用 ES6+ 编写的代码即使看上去没有副作用，但是经过 babel 编译后，仍然可能产生新的副作用（见[你的 Tree-Shaking 并没什么卵用](https://github.com/wuomzfx/tree-shaking-test)）。因此 tree-shaking 无法移除本来没有使用到的模块。

### UglifyJS 不够强

- tree-shaking 是用 UglifyJS 来删除那些没有副作用且没有被使用的代码。
- uglify 没有完善的程序流分析。它可以简单的判断变量后续是否被引用、修改，但是不能判断一个变量完整的修改过程，不知道它是否已经指向了外部变量，所以很多有可能会产生副作用的代码，都只能保守的不删除。

## webpack4+

- `tree-shaking` 依赖 ES6 的模块语法 `import`、`export`
- 将文件标记为无副作用  
  非 `production` 模式下，可以通过设置 `package.json` 的 `sideEffects` 属性来向 webpack 的 compiler 提示哪些代码是“纯粹部分”，即没有副作用，这样只是让 webpack 可以知道哪些代码是未用到的 `export` 导出，接下来需要在 bundle 中删除它们。

```js
// sideEffects 接受 2 种类型的值
{
  "name": "your-project",
  "sideEffects": false, // 所有代码都不包含副作用
  "sideEffects": [
    "./src/some-side-effectful-file.js", // 该文件代码包含副作用
    "*.css"
  ]
}
```

- 压缩输出  
  非 `production` 模式下，还需要利用类似 `UglifyJSPlugin` 这类插件来删除未使用到的代码，以及压缩代码等。
- 在 webpack4+，可以直接在 `webpack.config.js` 中设置 `mode` 为 `production` ，它启用默认配置进行 `tree-shaking`，且能够消除副作用。

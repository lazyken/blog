# Tree-Shaking

这是 webpack4 文档中 `tree-shaking` 部分的介绍：[https://v4.webpack.js.org/guides/tree-shaking/](https://v4.webpack.js.org/guides/tree-shaking/)，你可以先快速过一遍来了解一下什么是 `tree-shaking`。

## 什么是 tree-shaking

`tree-shaking` 是一个术语，通常指在 JavaScript 上下文中移除未使用的代码(dead-code)。它依赖于 ES2015 模块语法中的静态结构特性，例如 `import` 和 `export`。这个术语和概念兴起于 ES2015 模块打包工具 `rollup`。  
webpack 2 版本提供了对 ES2015 模块的内置支持，以及检测未使用的导出模块的能力。新的 webpack 4 版本扩展了这个功能，通过 `package.json` 的 `"sideEffects"` 属性作为标记，向编译器提供了提示，表示项目中的哪些文件是“纯”的，因此在未使用时可以安全删除它们。  
webpack 打包过程中，对 ES2015 模块代码能够进行 `tree-shaking`，减少无用代码缩小项目体积大小，起到优化项目的作用。

## 如何使用

### 1、使用 ES2015 模块语法(即 import 和 export)及其原理

项目中的模块代码需要使用 ES2015(ES6) 的模块语法(即 `import` 和 `export`)，这是 `tree-shaking` 的基础。  
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。这也是为什么 rollup 和 webpack 都要用 ES6 模块语法才能 `tree-shaking`。  
ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是 `tree-shaking` 的基础。  
所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6 之前的模块化，比如我们可以动态 `require` 一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

> 你可以阅读知乎的这个问题下的回答来了解更多：  
> [如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)：[https://www.zhihu.com/question/41922432](https://www.zhihu.com/question/41922432)  
> 以及百度外卖大前端团队在掘金的文章 —— [Tree-Shaking 性能优化实践 - 原理篇](https://juejin.cn/post/6844903544756109319)：[https://juejin.cn/post/6844903544756109319](https://juejin.cn/post/6844903544756109319)

### 2、注意其他编译工具

确保没有其他的编译工具把你的 ES6 模块转为 CommonJs 模块模块（这是流行的 `Babel preset @babel/preset-env` 的默认行为）。就像第 1 点中说的，对于 CommonJs 模块，`tree-shaking` 不起作用。  
但是 babel 对于我们开发项目来说又是必须的，我们应该如何处理呢？  
如果我们先进行 tree-shaking 打包，最后再编译 bundle 文件不就好了嘛。这确实是一个方案，然而可惜的是：这在处理项目自身资源代码时是可行的，处理外部依赖 npm 包就不行了。因为人家为了让工具包具有通用性、兼容性，大多是经过 babel 编译的。而最占容量的地方往往就是这些外部依赖包，依赖包没法 tree-shaking，依然存在未优化的代码。如此种种此消彼长的问题还有不少，你可以看一下这篇文章[你的 Tree-Shaking 并没什么卵用](https://github.com/wuomzfx/tree-shaking-test)：[https://github.com/wuomzfx/tree-shaking-test](https://github.com/wuomzfx/tree-shaking-test)

上面说了一些因为模块语法和编译工具的产生的问题，在 **webpack4**，你可以直接使用 `mode` 选项，设为 `production`，则 webpack 会默认进行包括 `tree-shaking` 在内的优化和代码压缩，且能很好的解决像 `babel` 这样的编译工具带来的副作用。

### 3、在项目 package.json 文件中，添加一个 "sideEffects" 入口。

在 webpack4 中扩展了对模块的检测能力，通过 `package.json` 的 `"sideEffects"` 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，因此在未使用时它可以安全地被删除。

```js
// sideEffects 接受 2 种类型的值
{
  "name": "your-project",
  "sideEffects": false, // 所有代码都不包含副作用
  "sideEffects": [
    "./src/some-side-effectful-file.js", // 该文件代码包含副作用，未使用到的代码不会被删除
    "*.css"
  ]
}
```

> [Webpack 中的 sideEffects 到底该怎么用？](https://zhuanlan.zhihu.com/p/40052192)：[https://zhuanlan.zhihu.com/p/40052192](https://zhuanlan.zhihu.com/p/40052192)  
> [webpack sideEffect 观察](https://zhuanlan.zhihu.com/p/44053307)：[https://zhuanlan.zhihu.com/p/44053307](https://zhuanlan.zhihu.com/p/44053307)

### 4、引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。

**webpack 的 tree-shaking 只是标记出了模块中哪些代码使用到了，哪些没有使用到，删除这些没有使用到的代码（dead-code）还需要压缩工具（比如 UglifyJsPlugin）来实现。**  
如果不做任何处理，`tree-shaking` 并不能非常显著地减小产物体积，原因简而言之，就是 `tree-shaking` 过程中， webpack 无法判断一个模块包是否有副作用，因此即使引入了它但没有使用，webpack 也只能保守地选择保留其代码。

```js
// webpack@4.44.2
// webpack.config.js
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'none', // 退出所有默认优化选项，改用optimization手动设置
  optimization: {
    usedExports: true, // 标记未使用（unused）的代码,让UglifyJs删除它
    minimize: true, // 是否压缩
    minimizer: [new UglifyJsPlugin()] // 压缩工具
  }
};
```

### 5、webpack4 的 production 模式

webpack4 提供了模式配置(mode)选项告诉 webpack 使用相应的内置优化。`mode` 选项的默认值为 `production`。
|选项|描述|
|---|---|
|development|使用 `webpack.DefinePlugin` 设置 `process.env.NODE_ENV`为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`|
|production|使用 `webpack.DefinePlugin` 设置 `process.env.NODE_ENV`为 `production`。启用 `FlagDependencyUsagePlugin`,`FlagIncludedChunksPlugin` , `ModuleConcatenationPlugin` , `NoEmitOnErrorsPlugin` , `OccurrenceOrderPlugin` , `SideEffectsFlagPlugin` and `TerserPlugin` 。|
|none|退出所有默认的优化选项|

webpack4 可以通过将 `"mode"` 选项配置为 `"production"`，来启用默认的配置选项进行代码压缩（删除 dead code，删除空格，删除注释等），消除副作用等优化。同时仍然可以配置 `Optimization` 属性来手动调整和覆盖默认配置。
如果没有选择 `production` 模式，则需要手动配置优化，引入压缩工具删除无用代码，消除副作用等。

## 实验一下 tree-shaking

由于 webpack2-4 经历了很多版本，不同版本的具体用法、配置等都有不少变化，下面只给出 `webpack@4.44.2` 版本的配置和相关伪代码示例

```js
// webpack@4.44.2
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  optimization: {
    usedExports: true // 标记未使用（unused）的代码
  }
};
```

```js
// src/math.js
export function square(x) {
  return x * x;
}
export function cube(x) {
  return x * x * x;
}
```

```js
// src/index.js
import { cube } from './math.js';
console.log('5 cubed is equal to ' + cube(5));
```

### mode 为 development 时，tree-shaking 对模块的标记

> 打包出来的 bundle.js,其中可以看到标记的部分：  
> \/\*! exports used: cube \*\/  
> \/\*! all exports used \*\/

```js
/************************************************************************/
  /******/ {
    /***/ './tree-shaking/b.js':
      /*!***************************!*\
  !*** ./tree-shaking/b.js ***!
  \***************************/
      /*! exports provided: square, cube */
      /*! exports used: cube */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          '/* unused harmony export square */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cube; });\nfunction square(x) {\n  return x * x;\n}\nfunction cube(x) {\n  return x * x * x;\n}\n\n\n//# sourceURL=webpack:///./tree-shaking/b.js?'
        );

        /***/
      },

    /***/ './tree-shaking/c.js':
      /*!***************************!*\
  !*** ./tree-shaking/c.js ***!
  \***************************/
      /*! no exports provided */
      /*! all exports used */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./b.js */ "./tree-shaking/b.js");\n\nconsole.log(\'5 cubed is equal to \' + Object(_b_js__WEBPACK_IMPORTED_MODULE_0__[/* cube */ "a"])(5));\n\n\n//# sourceURL=webpack:///./tree-shaking/c.js?'
        );

        /***/
      },
    /******/
  }
```

### mode 为 none 时，tree-shaking 对模块的标记

> 打包出来的 bundle.js,其中可以看到标记的部分：  
> \/\* unused harmony export square \*\/

```js
/************************************************************************/
/******/ [
  /* 0 */
  /***/ function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

    console.log('5 cubed is equal to ' + Object(_b_js__WEBPACK_IMPORTED_MODULE_0__[/* cube */ 'a'])(5));

    /***/
  },
  /* 1 */
  /***/ function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    /* unused harmony export square */
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', function () {
      return cube;
    });
    function square(x) {
      return x * x;
    }
    function cube(x) {
      return x * x * x;
    }

    /***/
  }
  /******/
];
```

### mode 为 production 时

可以看到代码已经被压缩了，且删除了无用代码，只保留了 `index.js` 和 `cube` 的代码。

```js
function(e,t,r){"use strict";var n;r.r(t),console.log("5 cubed is equal to "+(n=5)*n*n)}
```

至于 webpack2-3 版本的 `tree-shaking` 效果，不再继续展示了，有兴趣的可以自己试验一下。

# 总结

使用 `tree-shaking` 需要：

- 1、使用 ES6 模块语法，这样 webpack 能够标记出来未使用的代码（dead-code）,
- 2、使用 `UglifyJSPlugin` 这样的压缩工具来删除 `tree-shaking` 标记出来的无用代码。(webpack4 可以使用 mode 选项开启默认优化)

更多细节和注意事项，请阅读文末的参考资料。

参考资料：

1. [webpack4 文档：https://v4.webpack.js.org/guides/tree-shaking/](https://v4.webpack.js.org/guides/tree-shaking/)
2. [如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)：[https://www.zhihu.com/question/41922432](https://www.zhihu.com/question/41922432)
3. [你的 Tree-Shaking 并没什么卵用](https://github.com/wuomzfx/tree-shaking-test)：[https://github.com/wuomzfx/tree-shaking-test](https://github.com/wuomzfx/tree-shaking-test)
4. [Tree-Shaking 性能优化实践 - 原理篇](https://juejin.cn/post/6844903544756109319)：[https://juejin.cn/post/6844903544756109319](https://juejin.cn/post/6844903544756109319)
5. [Webpack 中的 sideEffects 到底该怎么用？](https://zhuanlan.zhihu.com/p/40052192)：[https://zhuanlan.zhihu.com/p/40052192](https://zhuanlan.zhihu.com/p/40052192)
6. [webpack sideEffect 观察](https://zhuanlan.zhihu.com/p/44053307)：[https://zhuanlan.zhihu.com/p/44053307](https://zhuanlan.zhihu.com/p/44053307)

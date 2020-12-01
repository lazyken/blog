# tree-shaking

最近在看 webpack 的 tree-shaking
tree-shaking 是一个术语，通常用于在 JavaScript 上下文中移除未使用的代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。  
webpack 2 版本提供了对 ES2015 模块的内置支持，以及对未使用模块导出检测的能力。新的 webpack 4 版本扩展了这个功能，通过 `package.json` 的 `"sideEffects"` 属性作为标记，向编译器提供了提示，表示项目中的哪些文件是“纯”的，因此在未使用时可以安全删除。

通过一番阅读后，大致可以得出：
1、
**webpack 的 tree-shaking 只是标记出了模块中哪些代码使用到了，哪些没有使用到，删除这些没有使用到的代码（dead-code）还需要压缩工具来实现。**
下面我们来尝试使用 webpack 2-4 版本实验 tree-shaking，来了解简单了解一些 tree-shaking 是如何在 webpack 中工作的。

## webpack4

在 webpack4 中使用 tree-shaking 主要有以下几点：

### 1、使用 ES2015 模块语法(即 import 和 export)

ES2015(ES6) 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。这也是为什么 rollup 和 webpack 都要用 ES6 module 语法才能 tree-shaking。  
ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是 `tree-shaking` 的基础。  
所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6 之前的模块化，比如我们可以动态 `require` 一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

### 2、注意其他编译工具

确保没有其他的编译工具（如 babel-loader）把你的 ES6 模块转为 CommonJs 模块模块（Babel preset @babel/preset-env 就会默认存在这种转换）。就像第 1 点中说的，对于 CommonJs 模块，tree-shaking 不起作用。  
但是 babel 对于我们开发项目来说又是必须的，我们应该如何处理呢？  
如果我们先进行 tree-shaking 打包，最后再编译 bundle 文件不就好了嘛。这确实是一个方案，然而可惜的是：这在处理项目自身资源代码时是可行的，处理外部依赖 npm 包就不行了。因为人家为了让工具包具有通用性、兼容性，大多是经过 babel 编译的。而最占容量的地方往往就是这些外部依赖包，依赖包没法 tree-shaking，依然存在未优化的代码。如此种种此消彼长的问题还有不少，你可以看一下这篇文章[你的 Tree-Shaking 并没什么卵用](https://github.com/wuomzfx/tree-shaking-test)

上面说了一些因为模块语法和编译工具的产生的问题，在 **webpack4**，你可以直接使用 `mode` 选项，设为 `production`，则 webpack 会默认进行包括 tree-shaking 在内的代码压缩，且能很好的解决像 `babel-loader` 这样的编译工具带来的副作用。

### 3、在项目 package.json 文件中，添加一个 "sideEffects" 入口。

webpack4 扩展了对模块的检测能力，通过 `package.json` 的 `"sideEffects"` 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，因此在未使用时它可以安全地被删除。

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

### 3、引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。

虽然 webapck 能检查到哪些代码没有被使用，但是删除这些无用代码还需要插件帮助。比如 UglifyJsPlugin 这类插件就能够压缩和删除无用代码。

关于 tree-shaking 的原理，及早期版本可能会存在的问题/坑，推荐阅读以下文章来了解：

1.
2. [Tree-Shaking 性能优化实践 - 原理篇](https://juejin.cn/post/6844903544756109319)
3. [Tree-Shaking](https://www.webpackjs.com/guides/tree-shaking/)

新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

关于 tree-shaking 需要了解的关键点：

## Tree-Shaking 的原理

1. 使用 ES6 的模块语法，ES6 的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码。
2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码。

## 副作用导致早期版本可能删除不掉未使用的模块代码

- 副作用大致可以理解成：一个函数会、或者可能会对函数外部变量产生影响的行为。
- 使用 ES6+ 编写的代码即使看上去没有副作用，但是经过 babel 编译后，仍然可能产生新的副作用（见[你的 Tree-Shaking 并没什么卵用](https://github.com/wuomzfx/tree-shaking-test)）。因此 tree-shaking 无法移除本来没有使用到的模块。

## UglifyJS 不够强

- tree-shaking 是用 UglifyJS 来删除那些没有副作用且没有被使用的代码。
- uglify 没有完善的程序流分析。它可以简单的判断变量后续是否被引用、修改，但是不能判断一个变量完整的修改过程，不知道它是否已经指向了外部变量，所以很多有可能会产生副作用的代码，都只能保守的不删除。

## webpack

### webpack4 之前

- `tree-shaking` 依赖 ES6 的模块语法 `import`、`export`
- 压缩输出  
  非 `production` 模式下，还需要利用类似 `UglifyJSPlugin` 这类插件来删除未使用到的代码，以及压缩代码等。

### webpack4

- 使用 ES2015 模块语法（即 `import` 和 `export`）。
- 将文件标记为无副作用  
  非 `production` 模式下，可以通过设置 `package.json` 的 `sideEffects` 属性来向 webpack 的 compiler 提示哪些代码是“纯粹部分”，即没有副作用，这样只是让 webpack 可以知道哪些代码是未用到的 `export` 导出，接下来需要在 bundle 中删除它们。

- 非 `production` 模式下，引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。
- webpack4 会根据选择的模式（mode）进行优化，但仍然可以配置 `Optimization` 属性来手动调整和覆盖默认配置。
- 在 webpack4，可以直接在 `webpack.config.js` 中设置 `mode` 为 `production` ，它启用默认配置进行 `tree-shaking`，且能够消除副作用。

大概是这样的：
webpack4 以及之前都需要经历这几个步骤
1、使用 ECMA2016（ES6）语法，来做静态分析
2、使用一个一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。

使用上的区别有：
1、webapck4 扩展了检测能力，可以通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。
2、webpack4 可以通过 "mode" 配置选项为 "production"，这样能启用默认的配置选项进行代码压缩（删除 dead code，删除空格，删除注释等）。同时仍然可以配置 `Optimization` 属性来手动调整和覆盖默认配置。

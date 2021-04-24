# 文件监听与热更新 HMR

热更新，指的是我们在本地开发的同时打开浏览器进行预览，当代码文件发生变化时，浏览器自动更新页面内容的技术。这里的自动更新，表现上又分为自动刷新整个页面，以及页面整体无刷新而只更新页面的部分内容。

与之相对的是在早期开发流程中，每次代码变更后需要手动刷新浏览器才能看到变更效果的情况。甚至于，代码变更后还需要手动执行打包脚本，完成编译打包后再刷新浏览器。而使用热更新，可以大大减少这些麻烦。

## 启用监听模式

未启用文件监听时，每当源码修改后，需要手动执行构建，得到最新的输出文件，且要手动重新用浏览器加载新的页面。  
文件监听是在发现源码发生变化时，自动重新构建出新的输出文件。

webpack 开启监听模式，有两种方式：

- 启动 webpack 命令时，带上 `--watch` 参数
- 在配置 webpack.config.js 中设置 `watch:true`

不过文件监听还是有些不足：在自动重新构建后，仍需要手动刷新页面

### 原理分析

- 轮询判断文件的最后编辑时间是否发生变化
- 某个文件发生变化，并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout` 时间后在通知监听者

```js
// webpack.config.watch.js
module.exports = {
  // 默认为false，也就是不开启
  watch: true,
  // 只有开启监听模式，watchOptions才有意义
  watchOptions: {
    // 默认为空，不监听等文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
    poll: 1000
  }
};
// package.json
"scripts":{
  "build:watch": "webpack --config webpack.config.watch.js"
}
```

## 使用 webpack-dev-srever

`webpack-dev-server` 是一个 npm 包，它提供了一个简单的 web 服务器和使用实时重载的能力。

```js
// webpack.config.reload.js
module.exports = {
  devServer: {
    contentBase: './dist',
    open: true // 启动服务后自动打开浏览器
  }
};
// package.js
"scirpts":{
  "dev:reload": "webpack-dev-server --config webpack.config.reload.js"
}
```

`webpack-dev-server` 在本地起了个 web 服务器，通过 websocket 与浏览器建立持久化链接，当源代码发生变更时，会通过 socket 通知网页端，网页端接到通知后会自动触发页面刷新。

到这一步，仍然还有需要解决到问题：devServer 能自动刷新页面，但是当页面有了一些状态后，刷新页面会导致页面丢失状态。

## HMR —— Hot Module Replace，模块热替换

为了解决页面刷新导致的状态丢失问题，webpack 提出了模块热替换的概念。  
在 webpack 中，webpacke 使用内置的 HotModuleReplacementPlugin 来实现模块热替换。
先来看一下怎么使用

```js
// hmr/index.js
import './style.css';
import Text from './text.js';
const div = document.createElement('div');
document.body.appendChild(div);
function render() {
  div.innerHTML = Text;
}
render();
// 调用 HotModuleReplacementPlugin 提供的 module.hot API 实现热更新
if (module.hot) {
  module.hot.accept('./text.js', function() {
    render();
  });
}
```

```css
/* hmr/style.css */
div {
  color: red;
}
```

```js
// hmr/text.js
const text = 'hello world1233';
export default text;
```

```js
// webpack.config.hmr.js
module.exports = {
  mode: 'development',
  entry: './hmr/index.js',
  output: {
    path: path.join(__dirname, './dist/hmr')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'hmr',
      hash: true
    })
  ],
  devServer: {
    contentBase: './dist/hmr',
    open: true,
    hot: true
  }
};
```

### css 模块热更新

按照上面的配置，当修改样式为`div { color: blue }`时，发现页面没有刷新，同时在控制台可以看到 head 标签中新增了 script 标签 `<script charset="utf-8" src="main.afb9daf584b3e1220f9a.hot-update.js"></script>` ，且 style 标签里的样式被替换成了 `div { color: blue }`。  
css 的热更新得益于`style-loader`的处理，在其内部通过 `module.hot` api 实现了热替换的逻辑。简化的代码大致如下：

```js
// "webpack": "^4.44.2"

var api = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ './node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js');
var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ './node_modules/css-loader/dist/cjs.js!./hmr/style.css');

content = content.__esModule ? content.default : content;

......

var update = api(content, options);

......

module.hot.accept(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ './node_modules/css-loader/dist/cjs.js!./hmr/style.css', function() {
  content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ './node_modules/css-loader/dist/cjs.js!./hmr/style.css');

  content = content.__esModule ? content.default : content;

  ......

  update(content);
});

module.hot.dispose(function() {
  update();
});
```

从上面的代码中我们可以看到，在运行时调用 API 实现将样式注入新生成的 style 标签，并将返回函数传递给 `update` 变量。然后，在 `module.hot.accept` 方法的回调函数中执行 `update(content)`，在 `module.hot.dispose` 中执行 `update()`。通过查看上述 API 的代码，可以发现 `update(content)` 是将新的样式内容更新到原 style 标签中，而 `update()` 则是移除注入的 style 标签。

在上面代码的两个 API 中，`hot.accept` 方法传入依赖模块名称和回调方法，当依赖模块发生更新时，其回调方法就会被执行，而开发者就可以在回调中实现对应的替换逻辑，即上面的用更新的样式替换原标签中的样式。另一个 `hot.dispose` 方法则是传入一个回调，当代码上下文的模块被移除时，其回调方法就会被执行。例如当我们在源代码中移除导入的 CSS 模块时，运行时原有的模块中的 `update()` 就会被执行，从而在页面移除对应的 style 标签。

### js 模块热更新

在上面的 `text.js` 中我们也调用了 `module.hot` 的 API 手动实现了热更新。如果没有手动调用，会发现修改 `text.js` 的内容，页面是直接刷新来更新，而不是热替换。  
这在平时的业务开发过程中并不常见，热更新的部分大多由相应的 loader 去处理。

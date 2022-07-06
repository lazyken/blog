# Mixins 被认为是有害的

> "我如何在几个组件之间共享代码？"是人们在学习 React 时首先提出的问题之一。我们的答案一直是使用组件组合来进行代码重用。您可以定义一个组件并在其他几个组件中使用它。

如何通过组合来解决某种模式并不总是很明显。React 受到函数式编程的影响，但它进入了由面向对象库主导的领域。 Facebook 内部和外部的工程师都很难放弃他们习惯的模式。

为了简化最初的采用和学习，我们在 React 中加入了某些逃生舱口。 mixin 系统就是其中之一，它的目标是当你不确定如何用组合解决同样的问题时，它的目标是为你提供一种在组件之间重用代码的方法。

React 发布三年过去了。风景变了。多视图库现在采用类似于 React 的组件模型。使用组合而不是继承来构建声明性用户界面不再是新鲜事。我们对 React 组件模型也更有信心，我们在内部和社区都看到了它的许多创造性使用。

在这篇文章中，我们将考虑由 mixins 引起的常见问题。然后，我们将为相同的用例建议几种替代模式。我们发现这些模式在代码库的复杂性上比 mixin 更好地扩展。

## 为什么 Mixins 不好

在 Facebook，React 的使用从几个组件增长到了数千个。这为我们提供了一个了解人们如何使用 React 的窗口。多亏了声明式渲染和自上而下的数据流，许多团队在采用 React 时能够在发布新功能的同时修复一堆错误。

然而不可避免的是，我们使用 React 的一些代码逐渐变得难以理解。有时，React 团队会在不同的项目中看到人们害怕接触的组件组。这些组件太容易被意外破坏，让新开发人员感到困惑，最终也让最初编写它们的人感到困惑。这种混乱大部分是由 mixins 引起的。当时，我不在 Facebook 工作，但在编写了相当多的糟糕的 mixin 之后，我得出了同样的结论。

这并不意味着 mixins 本身就不好。人们成功地以不同的语言和范式使用它们，包括一些函数式语言。在 Facebook，我们在 Hack 中广泛使用与 mixin 非常相似的特征。尽管如此，我们认为 mixin 在 React 代码库中是不必要的并且存在问题。这就是为什么（ Mixins 不好）。

### Mixins 引入了隐式依赖

有时，组件依赖于 mixin 中定义的某个方法，例如 `getClassName()`。有时情况正好相反，mixin 会在组件上调用类似 `renderHeader()` 的方法。 JavaScript 是一种动态语言，因此很难强制执行或记录这些依赖关系。

Mixins 打破了常见且通常安全的假设，即您可以通过在组件文件中搜索其出现来重命名状态键或方法。您可能会编写一个有状态的组件，然后您的同事可能会添加一个读取此状态的 mixin。几个月后，您可能希望将该状态移至父组件，以便与兄弟姐妹共享。你会记得更新 mixin 来读取 prop 吗？如果现在其他组件也使用这个 mixin 怎么办？

这些隐含的依赖关系使新团队成员很难为代码库做出贡献。组件的 `render()` 方法可能会引用一些未在类中定义的方法。删除是否安全？也许它是在其中一个 mixin 中定义的。但他们中的哪一个？您需要向上滚动到 mixin 列表，打开每个文件，然后查找此方法。更糟糕的是，mixins 可以指定自己的 mixins，因此搜索可以很深。

通常，mixin 依赖于其他 mixin，并且删除其中一个会破坏另一个。在这些情况下，很难判断数据如何流入和流出 mixins，以及它们的依赖关系图是什么样的。与组件不同，mixin 不形成层次结构：它们被扁平化并在同一个命名空间中运行。

### Mixins 导致名称冲突

不能保证两个特定的 mixin 可以一起使用。例如，如果 `FluxListenerMixin` 定义了 `handleChange()`，而 `WindowSizeMixin` 定义了 `handleChange()`，则不能一起使用。您也不能在自己的组件上定义具有此名称的方法。

如果你控制了 mixin 代码，这没什么大不了的。当您有冲突时，您可以在其中一个 mixin 上重命名该方法。然而这很棘手，因为某些组件或其他 mixin 可能已经直接调用了这个方法，你还需要找到并修复这些调用。

如果您与第三方包中的 mixin 有名称冲突，您不能只重命名它的方法。相反，您必须在组件上使用笨拙的方法名称以避免冲突。

对于 mixin 作者来说，情况也好不到哪里去。即使将新方法添加到 mixin 也始终是一个潜在的破坏性更改，因为具有相同名称的方法可能已经存在于使用它的某些组件上，无论是直接还是通过另一个 mixin。一旦编写好，mixin 就很难删除或更改。不好的想法不会被重构掉，因为重构的风险太大。

### Mixins 导致复杂度像滚雪球一样增加

即使 mixins 一开始很简单，随着时间的推移，它们也会变得复杂。下面的例子是基于我在代码库中看到的一个真实场景。

一个组件需要一些状态来跟踪鼠标的悬停。为了保持这个逻辑的可重用性，你可以将 `handleMouseEnter()`、`handleMouseLeave()`和 `isHovering()`提取到一个 `HoverMixin` 中。接下来，有人需要实现一个工具提示。他们不想重复 `HoverMixin` 中的逻辑，所以他们创建了一个使用 `HoverMixin` 的 `TooltipMixin`。`TooltipMixin` 在其 `componentDidUpdate()`中读取由 `HoverMixin` 提供的 `isHovering()`，并显示或隐藏工具提示。

几个月后，有人想让工具提示的方向可配置。为了避免代码重复，他们为 `TooltipMixin` 增加了对一个新的可选方法的支持，这个方法叫做 `getTooltipOptions()`。到这个时候，显示弹出式窗口的组件也使用 `HoverMixin`。然而弹出式窗口需要一个不同的悬停延迟。为了解决这个问题，有人增加了对可选的 `getHoverOptions()`方法的支持，并在 `TooltipMixin` 中实现了它。这些 mixins 现在是紧密耦合的。

这很好，因为没有新的要求。然而，这个解决方案并不能很好地扩展。如果你想在一个组件中支持显示多个工具提示怎么办？你不能在一个组件中两次定义同一个 mixins。如果工具提示需要在导览中自动显示，而不是在悬停时显示呢？祝你好运，将 `TooltipMixin` 与 `HoverMixin` 解耦。如果你需要支持悬停区域和工具提示锚位于不同组件中的情况呢？你不能轻易地把 mixin 使用的状态提升到父组件中。与组件不同，混合组件并不自然地适合这种变化。

每一个新的需求都会使 mixins 更难理解。使用同一 mixins 的组件随着时间的推移变得越来越耦合。任何新的能力都会被添加到所有使用该 mixins 的组件中。没有办法在不重复代码的情况下拆分 mixin 的 "简单 "部分，也没有办法在 mixin 之间引入更多的依赖性和间接性。渐渐地，封装的边界被侵蚀了，而且由于很难改变或删除现有的 mixins，它们不断变得更加抽象，直到没有人理解它们是如何工作的。

这些都是我们在 React 之前构建应用程序时所面临的相同问题。我们发现，这些问题可以通过声明式渲染、自上而下的数据流和封装的组件来解决。在 Facebook，我们一直在迁移我们的代码，以使用替代模式来混合，我们对结果普遍感到满意。你可以在下面阅读这些模式。

## 从 mixins 迁移

让我们清楚地表明，mixins 在技术上并没有被废弃。如果你使用 `React.createClass()`，你可以继续使用它们。我们只是说，它们对我们来说效果不好，所以我们不建议在未来使用它们。

下面的每一节都对应着我们在 Facebook 代码库中发现的 mixin 使用模式。对于每一个例子，我们都描述了问题和我们认为比 mixin 效果更好的解决方案。这些例子都是用 ES5 写的，但一旦你不需要 mixin，如果你愿意，你可以切换到 ES6 类。

我们希望你能发现这个列表对你有帮助。如果我们遗漏了重要的用例，请让我们知道，这样我们就可以修改列表或者被证明是错误的!

### 性能优化

最常用的 mixins 之一是 [`PureRenderMixin`](https://react.docschina.org/docs/pure-render-mixin.html)。你可能会在一些组件中使用它，以防止在 props 和 state 与之前的 props 和 state 浅层相等时进行[不必要的重新渲染](https://react.docschina.org/docs/advanced-performance.html#shouldcomponentupdate-in-action)。

```js
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Button = React.createClass({
  mixins: [PureRenderMixin]

  // ...
});
```

#### 解决方案

要想在没有 mixins 的情况下表达相同的内容，你可以直接使用 [shallowCompare](https://react.docschina.org/docs/shallow-compare.html) 函数来代替:

```js
var shallowCompare = require('react-addons-shallow-compare');

var Button = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  // ...
});
```

如果你使用一个自定义的 mixin 来实现不同算法的 `shouldComponentUpdate` 函数，我们建议只从模块中导出那个单一的函数，并从你的组件中直接调用它。

我们理解，更多的类型会让人厌烦。对于最常见的情况，我们计划在下一个小版本中引入一个[新的基类](https://github.com/facebook/react/pull/7195)，称为 `React.PureComponent`。它使用与 `PureRenderMixin` 今天一样的浅层比较。

#### 订阅和副作用

我们遇到的第二种最常见的 mixins 类型是将 React 组件订阅到第三方数据源的 mixins。无论这个数据源是 Flux Store、Rx Observable 还是其他什么，其模式都非常相似：订阅在 `componentDidMount` 中创建，在 `componentWillUnmount` 中销毁，变化处理程序调用 `this.setState()`。

```js
var SubscriptionMixin = {
  getInitialState: function() {
    return {
      comments: DataSource.getComments()
    };
  },

  componentDidMount: function() {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function() {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function() {
    this.setState({
      comments: DataSource.getComments()
    });
  }
};

var CommentList = React.createClass({
  mixins: [SubscriptionMixin],

  render: function() {
    // Reading comments from state managed by mixin.
    var comments = this.state.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />;
        })}
      </div>
    );
  }
});

module.exports = CommentList;
```

### 解决方案

如果只有一个组件订阅了这个数据源，将订阅逻辑直接嵌入到组件中就可以了。避免过早的抽象化。

如果有几个组件使用这个 mixin 来订阅一个数据源，那么避免重复的一个好办法就是使用一种叫做 ["higher-order components"（高阶组件](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)的模式。这听起来很吓人，所以我们将仔细看看这种模式是如何从组件模型中自然产生的。

### 高阶组件的解释

让我们暂时忘记 React。考虑一下这两个函数，它们对数字进行加法和乘法，在做这些事情时记录结果。

```js
function addAndLog(x, y) {
  var result = x + y;
  console.log('result:', result);
  return result;
}

function multiplyAndLog(x, y) {
  var result = x * y;
  console.log('result:', result);
  return result;
}
```

这两个函数不是很有用，但它们帮助我们展示了一种模式，以后我们可以将其应用于组件。

假设我们想从这些函数中提取日志逻辑而不改变它们的签名。我们怎样才能做到这一点呢？一个优雅的解决方案是写一个[高阶函数](https://en.wikipedia.org/wiki/Higher-order_function)，也就是一个将一个函数作为参数并返回一个函数的函数。

同样，这听起来比实际情况更令人生畏:

```js
function withLogging(wrappedFunction) {
  // Return a function with the same API...
  return function(x, y) {
    // ... that calls the original function
    var result = wrappedFunction(x, y);
    // ... but also logs its result!
    console.log('result:', result);
    return result;
  };
}
```

`withLogging` 高阶函数让我们在写加法和乘法的时候不需要记录语句，之后再把它们包装起来，得到 `addAndLog` 和 `multiplyAndLog`，其签名与之前完全一样:

```js
function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

function withLogging(wrappedFunction) {
  return function(x, y) {
    var result = wrappedFunction(x, y);
    console.log('result:', result);
    return result;
  };
}

// Equivalent to writing addAndLog by hand:
var addAndLog = withLogging(add);

// Equivalent to writing multiplyAndLog by hand:
var multiplyAndLog = withLogging(multiply);
```

高阶组件是一种非常类似的模式，但在 React 中应用于组件。我们将分两步来应用这种来自 mixins 的转换。

第一步，我们将把 `CommentList` 组件一分为二，一个子组件和一个父组件。子组件将只关注渲染评论。父组件将设置订阅，并通过 props 将最新的数据传递给子组件。

```js
// This is a child component.
// It only renders the comments it receives as props.
var CommentList = React.createClass({
  render: function() {
    // Note: now reading from props rather than state.
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />;
        })}
      </div>
    );
  }
});

// This is a parent component.
// It subscribes to the data source and renders <CommentList />.
var CommentListWithSubscription = React.createClass({
  getInitialState: function() {
    return {
      comments: DataSource.getComments()
    };
  },

  componentDidMount: function() {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function() {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function() {
    this.setState({
      comments: DataSource.getComments()
    });
  },

  render: function() {
    // We pass the current state as props to CommentList.
    return <CommentList comments={this.state.comments} />;
  }
});

module.exports = CommentListWithSubscription;
```

现在只剩下最后一步了。

还记得我们是如何让 `withLogging()`接收一个函数并返回另一个封装它的函数的吗？我们可以将类似的模式应用于 React 组件。

我们将写一个新的函数叫 `withSubscription(WrappedComponent)`。它的参数可以是任何 React 组件。我们将传递 `CommentList` 作为 `WrappedComponent`，但我们也可以将 `withSubscription()`应用于我们代码库中的任何其他组件。

这个函数将返回另一个组件。返回的组件将管理订阅，并以当前数据呈现`<WrappedComponent />`。

我们称这种模式为 "higher-order component(高阶组件)"。

构成发生在 React 渲染层面，而不是直接调用函数。这就是为什么被包装的组件是用 `createClass()`定义的，是 ES6 类还是函数并不重要。如果 `WrappedComponent` 是一个 React 组件，由 `withSubscription()`创建的组件可以渲染它。

```js
// This function takes a component...
function withSubscription(WrappedComponent) {
  // ...and returns another component...
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function() {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function() {
      this.setState({
        comments: DataSource.getComments()
      });
    },

    render: function() {
      // ... and renders the wrapped component with the fresh data!
      return <WrappedComponent comments={this.state.comments} />;
    }
  });
}
```

现在我们可以通过对 `CommentList` 应用 `withSubscription` 来声明 `CommentListWithSubscription`:

```js
var CommentList = React.createClass({
  render: function() {
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />;
        })}
      </div>
    );
  }
});

// withSubscription() returns a new component that
// is subscribed to the data source and renders
// <CommentList /> with up-to-date data.
var CommentListWithSubscription = withSubscription(CommentList);

// The rest of the app is interested in the subscribed component
// so we export it instead of the original unwrapped CommentList.
module.exports = CommentListWithSubscription;
```

#### 解决方案，重新审视

现在我们对高阶组件有了更多的了解，让我们再来看看不涉及混搭的完整解决方案。有一些小的变化，用内联注释来说明:

```js
function withSubscription(WrappedComponent) {
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function() {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function() {
      this.setState({
        comments: DataSource.getComments()
      });
    },

    render: function() {
      // Use JSX spread syntax to pass all props and state down automatically.
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  });
}

// Optional change: convert CommentList to a function component
// because it doesn't use lifecycle methods or state.
function CommentList(props) {
  var comments = props.comments;
  return (
    <div>
      {comments.map(function(comment) {
        return <Comment comment={comment} key={comment.id} />;
      })}
    </div>
  );
}

// Instead of declaring CommentListWithSubscription,
// we export the wrapped component right away.
module.exports = withSubscription(CommentList);
```

高阶组件是一种强大的模式。如果你想进一步定制它们的行为，你可以向它们传递额外的参数。毕竟，它们甚至不是 React 的一个功能。它们只是接收组件并返回包裹组件的函数。

像任何解决方案一样，高阶组件也有自己的陷阱。例如，如果你大量使用 [refs](https://react.docschina.org/docs/more-about-refs.html)，你可能会注意到，把某个东西包装到一个高阶组件中会改变 ref，使其指向包装组件。在实践中，我们不鼓励在组件通信中使用 refs，所以我们认为这不是一个大问题。在未来，我们可能会考虑在 React 中加入 (ref forwarding)[https://github.com/facebook/react/issues/4213] 来解决这个问题。

### 渲染逻辑

我们在代码库中发现的 mixins 的下一个最常见的用例是在组件之间共享渲染逻辑。

下面是这种模式的一个典型例子:

```js
var RowMixin = {
  // Called by components from render()
  renderHeader: function() {
    return (
      <div className='row-header'>
        <h1>{this.getHeaderText() /* Defined by components */}</h1>
      </div>
    );
  }
};

var UserRow = React.createClass({
  mixins: [RowMixin],

  // Called by RowMixin.renderHeader()
  getHeaderText: function() {
    return this.props.user.fullName;
  },

  render: function() {
    return (
      <div>
        {this.renderHeader() /* Defined by RowMixin */}
        <h2>{this.props.user.biography}</h2>
      </div>
    );
  }
});
```

多个组件可能会共享 `RowMixin` 来渲染标题，而每个组件都需要定义 `getHeaderText()`。

#### 解决方案

如果你看到 mixin 里面的渲染逻辑，那就是提取一个组件的时候了！

取代 `RowMixin`，我们将定义一个`<RowHeader>`组件。我们还将用 React 中顶层数据流的标准机制：传递 props 来取代定义 `getHeaderText()`方法的惯例。

最后，由于这些组件目前都不需要生命周期方法或状态，我们可以将它们声明为简单的函数:

```js
function RowHeader(props) {
  return (
    <div className='row-header'>
      <h1>{props.text}</h1>
    </div>
  );
}

function UserRow(props) {
  return (
    <div>
      <RowHeader text={props.user.fullName} />
      <h2>{props.user.biography}</h2>
    </div>
  );
}
```

props 使组件的依赖关系明确，易于替换，并可通过`Flow`和`TypeScript`等工具强制执行。

> 注意:
>
> 将组件定义为函数并不是必须的。使用生命周期方法和状态也没有错，它们是一流的 React 特性。我们在这个例子中使用了函数组件，因为它们更容易阅读，而且我们不需要这些额外的功能，但 classes 也同样可以工作。

### Context

我们发现的另一组 mixins 是用于提供和消费 [React context](https://react.docschina.org/docs/context.html)的帮助器。Context 是一个实验性的不稳定的功能，[有一些问题](https://github.com/facebook/react/issues/2517)，并且在未来可能会改变其 API。我们不建议使用它，除非你确信没有其他方法可以解决你的问题。

尽管如此，如果你今天已经使用了 context，你可能一直在用这样的 mixins 隐藏了它的使用:

```js
var RouterMixin = {
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  // The mixin provides a method so that components
  // don't have to use the context API directly.
  push: function(path) {
    this.context.router.push(path);
  }
};

var Link = React.createClass({
  mixins: [RouterMixin],

  handleClick: function(e) {
    e.stopPropagation();

    // This method is defined in RouterMixin.
    this.push(this.props.to);
  },

  render: function() {
    return <a onClick={this.handleClick}>{this.props.children}</a>;
  }
});

module.exports = Link;
```

#### 解决方案

我们同意，在 context API 稳定之前，将 context 的使用隐藏在消费组件中是一个好主意。然而，我们建议使用高阶组件而不是 mixins 组件来实现这一点。

让包装组件从 context 中抓取一些东西，然后用 props 将其传递给被包装组件：

```js
function withRouter(WrappedComponent) {
  return React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },

    render: function() {
      // The wrapper component reads something from the context
      // and passes it down as a prop to the wrapped component.
      var router = this.context.router;
      return <WrappedComponent {...this.props} router={router} />;
    }
  });
}

var Link = React.createClass({
  handleClick: function(e) {
    e.stopPropagation();

    // The wrapped component uses props instead of context.
    this.props.router.push(this.props.to);
  },

  render: function() {
    return <a onClick={this.handleClick}>{this.props.children}</a>;
  }
});

// Don't forget to wrap the component!
module.exports = withRouter(Link);
```

如果你使用的第三方库只提供了一个 mixin 组件，我们鼓励你向他们提交一个问题，链接到这个帖子，以便他们能够提供一个高阶组件。同时，你也可以用完全相同的方法围绕它创建一个高阶组件。

## 公共方法（Utility Methods）

有时，mixins 只被用来在组件之间共享公共方法：

```js
var ColorMixin = {
  getLuminance(color) {
    var c = parseInt(color, 16);
    var r = (c & 0xff0000) >> 16;
    var g = (c & 0x00ff00) >> 8;
    var b = c & 0x0000ff;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }
};

var Button = React.createClass({
  mixins: [ColorMixin],

  render: function() {
    var theme = this.getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return <div className={theme}>{this.props.children}</div>;
  }
});
```

#### 解决方案

把公共方法放到常规的 JavaScript 模块中并导入它们。这也使得测试它们或在你的组件之外使用它们更加容易。

```js
var getLuminance = require('../utils/getLuminance');

var Button = React.createClass({
  render: function() {
    var theme = getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return <div className={theme}>{this.props.children}</div>;
  }
});
```

## 其他用例

有时，人们会使用 mixins 来选择性地将日志记录添加到某些组件的生命周期方法中。在未来，我们打算提供一个官方的 DevTools API，让你在不接触组件的情况下实现类似的功能。然而，这仍然是一项正在进行的工作。如果你在调试时严重依赖日志 mixins，你可能会想继续使用这些 mixins 一段时间。

如果你不能用一个组件、一个高阶组件或一个公共函数模块来完成一些事情，这可能意味着 React 应该开箱即提供这些功能。提交一个问题，告诉我们你对 mixins 的使用情况，我们会帮助你考虑替代方案或实现你的功能请求。

从传统意义上讲，Mixins并没有被废弃。你可以继续用 `React.createClass()`来使用它们，因为我们不会进一步改变它。最终，随着 ES6 类获得更多的采用，以及它们在 React 中的可用性问题得到解决，我们可能会把 `React.createClass()`拆成一个单独的包，因为大多数人不需要它。即使在这种情况下，你的旧 mixins 也会继续工作。

我们相信上面的替代方案对绝大多数情况来说都是更好的，我们邀请你尝试在不使用混搭的情况下编写 React 应用程序。

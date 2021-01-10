本篇是偏向手册类型的总结性文章。

- 平时在写 React 时，遇到最频繁的场景就是组件的更新了，也总是避免不了考虑是否要对组件的更新进行优化，因此归纳总结一下，一方面有助于理清思路，避免混淆众多的 API；另一方面也可以当作复习。
- 第一部分主要讲 React 最基本的更新方式，其他复杂的更新场景都是最基本的场景的组合。然后也专门提出了一种需要注意的特殊情况。
- 第二部分主要从 React 的各种 API 来归纳，React 可以如何优化组件的**不必要的**更新。
- 掌握了最基本的更新和优化手段后，其他复杂场景都可以以此来进行分析和优化。

如果你还有其他关于触发 React 更新和优化 React 不必要的更新的 API 或者方法，请在下面评论告诉我，感谢！

# 第一部分：更新

## 基础更新

### 类组件

- 当 `props` 或者 `state` 发生变化时，类组件根据 `shouldComponentUpdate` 的返回值来决定是否更新组件。`shouldComponentUpdate` 默认始终返回 `true`，因此当 `props` 或者 `state` 发生变化时，默认情况下类组件始终会更新。

```js
shouldComponentUpdate(nextProps, nextState);
```

- 注意，`shouldComponentUpdate` 返回 `false` 虽然会阻止组件更新和渲染，但是 `this.setState` 仍会更新 `state` 的值。

### 函数式组件，Hooks

- `props` 更新时，新旧 `props` 不相等时组件会更新。
- Hook 中，使用 `setState` hook 更新 `state`，新旧 `state` 不相等时组件会更新；新旧 `state` 相等时，在第一次更新 `state` 时，组件也会更新，之后更新相同的 `state` 值，组件不会更新。

## forceUpdate

```js
component.forceUpdate(callback);
```

调用 `forceUpdate()` 强制让组件重新渲染；致使组件调用 `render()` 方法；此操作会跳过该组件的 `shouldComponentUpdate()`。

### Provider 和 consumer 的更新

对于 Provider 组件的 `value` 更新时，文档中有这样一句话：

> 当 Provider 组件的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 组件及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

这句话什么意思呢，举个例子：

```js
import React, { Component } from 'react';
import { render } from 'react-dom';

const CountCtx = React.createContext(0);

class Child extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <CountCtx.Consumer>{(count) => <h1>{count}</h1>}</CountCtx.Consumer>;
  }
}

class App extends Component {
  state = {
    count: 0
  };

  inc = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <CountCtx.Provider value={this.state.count}>
        <button onClick={this.inc}>inc</button>
        <Child />
      </CountCtx.Provider>
    );
  }
}

render(<App />, document.getElementById('root'));
```

例子中，即使 `Child` 的 `shouldComponentUpdate` 始终返回 `false`，`CountCtx.Consumer` 组件也会更新。

- Provider 组件的 `value` 值发生变化时，Provider 组件和它内部的 consumer 组件都会更新，且 consumer 组件不受祖先组件的 `shouldComponentUpdate` 影响，会直接更新。
- `useContext` Hook 也是会在 Provider 组件更新时触发其所在的组件更新。

> Redux 的 `connect` 也有类似的不受祖先组件限制能够直接更新深层次子消费组件的效果。

## 子组件与 children

父子组件在组合嵌套使用时，有以下 2 种使用场景，这 2 种场景下，组件更新的表现也会有所不同:

```js
// 场景一，子组件直接写在父级组件内
function Parent() {
  const [parentCount, setParentCount] = useState(0);
  console.log('parent update');
  return (
    <div>
      <p>Parent component count: {parentCount}</p>
      <input
        defaultValue={parentCount}
        onBlur={(e) => {
          setParentCount(+e.target.value);
        }}
      />
      <br />
      <br />
      <Child />
    </div>
  );
}
function Child(props) {
  const [childCount, setChildCount] = useState(0);
  console.log('child update');
  return (
    <div>
      <p>Child Component count:{childCount}</p>
      <button
        onClick={() => {
          setChildCount((preCount) => preCount + 1);
        }}
      >
        add child count
      </button>
    </div>
  );
}
```

```js
// 场景二，子组件通过children的形式传入父级组件
function App() {
  return (
    <Parent>
      <Child />
    </Parent>
  );
}
function Parent(props) {
  const [parentCount, setParentCount] = useState(0);
  console.log('parent update');
  return (
    <div>
      <span>Parent component count: {parentCount}</span>
      <input
        defaultValue={parentCount}
        onBlur={(e) => {
          setParentCount(+e.target.value);
        }}
      />
      <br />
      <br />
      {props.children}
    </div>
  );
}
function Child(props) {
  const [childCount, setChildCount] = useState(0);
  console.log('child update');
  return (
    <div>
      <span>Child Component count:{childCount}</span>
      <button
        onClick={() => {
          setChildCount((preCount) => preCount + 1);
        }}
      >
        add child count
      </button>
    </div>
  );
}
```

- 场景一：父级组件更新时，子组件也会更新
- 场景二：父级组件更新时，子组件不会更新

造成这种区别的主要原因是，在编译阶段编译 JSX 时:

- 场景一中直接在 `Parent` 组件内写的子组件 `Child`，会使用 `React.createElement(Child)` 进行编译，返回编译后的 React Node 对象，因此每次 `Parent` 组件更新，`Parent` 的 JSX 都会重新编译，`Child` 组件也会被重新编译，既然 `Child` 组件重新编译了，返回的自然就是另一个 React Node 对象，即便他们看上去一样，但是他们都是引用类型的数据，因此他们不相等，子组件会更新。
- 场景二与场景一的区别在于，二中的 `Child` 是先在 `App` 组件内编译成 React Node 再通过 `props` 传给 `Parent` 组件的，因此 `Parent` 组件更新时，通过 `props.children` 拿到的始终是最开始编译 `Child` 组件返回的 React Node 对象，它始终没有改变，因此子组件 `Child` 不会更新。

> 关于这部分内容，你也可以阅读下面两篇文章获得更多理解：  
> 1、 [我在大厂写 React，学到了什么？性能优化篇](https://juejin.im/post/6889247428797530126)  
> 2、 [React 组件到底什么时候 render 啊](https://juejin.im/post/6886766652667461646)

# 第二部分：优化

## shouldComponentUpdate

```js
shouldComponentUpdate(nextProps, nextState);
```

- `shouldComponentUpdate` 默认返回 `true`，即类组件在 `props` 或 `state` 发生变化时，不论新旧值是否相等，默认总是会更新。
- 你可以在类组件中手写`shouldComponentUpdate`，可以将 `this.props` 与 `nextProps` 以及 `this.state` 与 `nextState` 进行比较，通过返回 `true` 或者 `false` 来决定是否更新当前组件。

## React.PureComponent

- `React.PureComponent` 中以浅层对比 `prop` 和 `state` 的方式来实现 `shouldComponentupdate()` 。
- `React.PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 `prop` 更新。因此，请确保所有子组件也都是“纯”的组件。
- 使用 `React.PureComponent` 可以自动处理纯组件的更新优化，避免在 `React.Component` 中手写 `shouldComponentUpdate` 。

## React.memo

- 只适用于函数式组件，不适用于 class 组件。
- `React.memo` 仅检查 `props` 变更。如果你的函数组件在给定相同 `props` 的情况下渲染相同的结果，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
- 如果函数组件被 `React.memo` 包裹，且其实现中拥有 `useState` 或 `useContext` 的 Hook，当 `context` 或 `state` 发生变化时，它仍会重新渲染。
- 默认情况下 `React.memo` 只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

## useCallback

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- `useCallback` 返回一个 memoized 回调函数，该回调函数仅在某个依赖项改变时才会更新。
- 当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 把“创建”函数和依赖项数组作为参数传入 `useMemo`，它返回函数执行的结果，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
- 当你把 memoizedValue 传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

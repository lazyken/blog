# React Hook API Notes

之前阅读了一些 Hook 概览后就开始写业务代码了，但是发现还是有很多细节没记住，掌握不牢，不知道等。于是“抄书”，写写笔记，便于快速复习。

## useState

- `setState` 函数用于更新 `state`。它接收一个新的 `state` 值并将组件的一次重新渲染加入队列。在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 `state`。
- 组件每次更新取到的 `state` 和 `setState` 都是当前这次渲染的 `state` 和 `setState`。
- 当你使用 `state` 时取到的就是当前这次更新的 `state` ，在异步的回调中取到的也是它被创建的那次渲染时的 `state`，因为下一次渲染时的 `state` 是下一个 `state`，而本次渲染在异步回调中保存的是本次渲染时的 `state`。
- 如果新的 `state` 需要通过使用先前的 `state` 计算得出，那么可以将函数传递给 `setState` 。该函数将接收先前的 `state` ，返回值作为新的值更新 `state` 。
- `initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 `state` 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 `state` ，此函数只在初始渲染时被调用

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

## useEffect

- 组件每次更新，在渲染完成之后会进行清除上一次的 `useEffect` 的操作，然后重新执行 `useEffect`，这个清除操作"只"是一个 effect hook 的机制，如想要执行具体的清除的操作，如取消订阅，清理定时器，取消请求等，需要在 `useEffect` 返回一个函数，在这个返回的函数中处理具体的清理操作。
- 默认的，组件每次更新都会重新执行 `useEffect`，但是可以传入第二个参数，它是 `useEffect` 的依赖项数组，控制 `useEffect` 是否执行。组件更新时，只有在依赖项也发生变化时才会清除上一次 `useEffect` 和 重新执行 `useEffect` ，否则会跳过该次 `useEffect` 的更新。传空数组 `[]` 时则只会在第一次执行，后续更新都不会执行。所以，总结来说， `useEffect` 是否更新（清除上一次和重新执行本次）取决于它的依赖项数组（没有依赖始终更新；有依赖则依赖项变化就更新，不变不更新；空数组只更新第一次）。
- 执行时机：在浏览器完成布局与绘制之后，传给 `useEffect` 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。虽然 `useEffect` 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。React 将在组件更新前刷新上一轮渲染的 effect。`useLayoutEffect` 和 `useEffect` 的结构相同，区别只是调用时机不同。它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

## Hook 规则

### 1、只在最顶层使用 Hook

不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层调用他们。如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的内部.
react hook 在多次渲染中需要保证每次渲染时所有的 hook 的调用顺序是不变的，这可以让 React 知道哪个 `state` 对应的是哪个 `useState`。

> 到这里其实我是有疑问的，为啥会产生这样的使用要求呢？是什么原因导致需要保证调用顺序一致呢？就如官方文档里的自问自答一样：_“那么 React 怎么知道哪个 `state` 对应哪个 `useState`？答案是 React 靠的是 Hook 调用的顺序。”_，为什么 React 不知道 `state` 对应哪个 `useState`？又为什么需要知道呢？头大！后来简单了解了一下，好像和 Hook 的状态的保存和更新有关，React Hook 有它自己的设计，俺暂时还解释不了，以后弄懂了再说

### 2、只在 React 函数中调用 Hook，不要在普通的 JavaScript 函数中调用 Hook

Hook 可以这样使用：

- 在 React 的函数组件中调用 Hook
- 在自定义 Hook 中调用其他 Hook

## 自定义 Hook

**自定义 Hook，可以将组件逻辑提取到可重用的函数中。**

> 当我们想在两个函数之间共享逻辑时，我们会把它提取到第三个函数中。而组件和 Hook 都是函数，所以也同样适用这种方式。

至此，React 一共有三种方式共享（提取）组件间的公共状态逻辑:

- render props
- 高阶组件（HOC）
- 自定义 Hook

#### 在两个组件中使用相同的 Hook 会共享 state 吗？获取的是独立的 state 吗？

每次使用自定义 Hook 时，其中的所有 `state` 和副作用都是完全隔离的；从 React 的角度来看，使用自定义 Hook 时只是调用了 `useState` 和 `useEffect`，在多个组件中多次调用 `useState` 和 `useEffect`，它们是完全独立的。

## useContext

> const AppContext = React.createContext(defaultValue);

- 接收一个 `context` 对象并返回 `context` 的当前值：`const appContextValue = useContext(AppContext)`
- 当前的 `context` 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。
- 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用 `<MyContext.Provider>` 的 `value` 属性的最新值。
- 调用了 `useContext` 的组件总会在它返回的 `context` 当前值变化时重新渲染。

## useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

### 惰性初始化

你可以选择惰性地创建初始 `state`。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 `state` 将被设置为 `init(initialArg)`。
这么做可以将用于计算 `state` 的逻辑提取到 `reducer` 外部，这也为将来对重置 `state` 的 `action` 做处理提供了便利。

### 跳过 dispatch

如果 Reducer Hook 的返回值与当前 `state` 相同，React 将跳过子组件的渲染及副作用的执行。

## useCallback

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- 返回一个 memoized 回调函数。
- `useCallback` 返回 参数函数的 memoized 的版本，只有当依赖改变时返回的函数才会更新，这在把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时非常有用。

## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 返回一个 memoized 值。
- 把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
- 传入 `useMemo` 的函数会在渲染期间执行。不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`。
- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。

## Refs & DOM

Refs 对象是通过 `React.createRef()` 创建的，一般是赋值给 `render`方法中的 **jsx 的 DOM 元素** 或者 **类组件实例** 的 `ref` 属性，来保存对 DOM 元素或者组件实例的引用，此时该引用保存在 Refs 对象的 `current` 属性上。

- 当 `ref` 属性用于 HTML 元素时，构造函数中使用 `React.createRef()` 创建的 Ref 对象接收底层 DOM 元素作为其 `current` 属性。
- 当 `ref` 属性用于自定义 class 组件时，Ref 对象接收组件的挂载实例作为其 `current` 属性。
- 由于 Refs 对象保存的是 DOM 元素或者类组件实例，因此，你不能在函数组件**上**使用 ref 属性，因为他们没有实例。（即： Refs 对象不能保存函数式组件的引用，在函数式组件上（注意不是函数式组件内，别搞混淆）使用 ref 属性没有用，估计也会报错，我没有试过）
- 通常会把 Refs 对象赋值给组件实例属性，以便可以在整个组件中引用它们。

### 如果要在函数组件**中**使用 ref，可以使用**forwardRef**

forwardRef 即 Refs 转发。Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className='FancyButton'>
    {props.children}
  </button>
));

// 可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

逐步解释一下上面的代码：

1. 通过调用 `React.createRef` 创建了一个**React Ref**对象 并将其赋值给 `ref` 变量。
2. 通过指定 `ref` 变量 为 JSX 的 `ref` 属性，将其向下传递给 `<FancyButton ref={ref}>`。
3. React 传递 `ref`变量（即 Ref 对象）给 `forwardRef` 内函数 `(props, ref) => ...`，作为其第二个参数。
4. 我们向下转发该 `ref`（即 Ref 对象）参数到 `<button ref={ref}>`，将其指定为 JSX 的 `ref` 属性。
5. 当 Ref 挂载完成，`ref.current`(变量 ref 的 current 属性) 将指向 `<button>` DOM 节点。

- **第二个参数 `ref` 只在使用 `React.forwardRef` 定义组件时存在。常规函数和 class 组件不接收 `ref` 参数，且 props 中也不存在 `ref`。**
- **Ref 转发不仅限于 DOM 组件，你也可以转发 Refs 到 class 组件实例中。**
- **在高阶组件上使用 ref 属性时需要注意，正常情况下 ref 属性指向的是高阶组件本身而不是高阶组件包裹的组件，因此想转发 Ref 对象到高阶组件包裹的组件内部时，需要使用 Ref 转发。**

### 回调 Refs

回调 Refs 是将一个回调函数作为 `ref` 属性的值，这个回调函数接受 React 组件实例或者 DOM 元素作为参数。而回调函数可以灵活地进行传递，因此可以在父级组件创建并向子组件进行传递回调函数，这样父组件可以在回调函数内获取子组件 DOM 元素的引用。回调 Refs 也可以直接在当前组件使用。

- React 将在组件挂载时，调用赋值给 `ref` 属性的回调函数并传入 DOM 元素，当卸载时调用它并传入 `null`。在 `componentDidMount` 或 `componentDidUpdate` 触发前，React 会保证 Refs 一定是最新的(即回调函数传入的 DOM 元素是最新的)。

## useRef

```js
const refContainer = useRef(initialValue);
```

- `useRef` 返回一个可变的 Ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。
- 返回的 Ref 对象在组件的整个生命周期内保持不变。
- 返回的 Ref 对象是一个普通 js 对象，可以保存任何值，且每次渲染返回的都是同一个 Ref 对象。
- 当 Ref 对象内容发生变化时，`useRef` 并不会通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 Ref 来实现。

## useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps]);
```

`useImperativeHandle` 可以让你在使用 Ref 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 Ref 这样的命令式代码。`useImperativeHandle` 应当与 `forwardRef` 一起使用：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中，渲染 `<FancyInput ref={inputRef} />` 的父组件可以调用 `inputRef.current.focus()`。

## useLayoutEffect

`useLayoutEffect` 与 `useEffect` 的使用方式相同，区别在于 2 者接受的回调函数（即 effect）的执行时机不同。
`useLayoutEffect` ：会在所有的 DOM 变更之后同步调用 effect，它与 `componentDidMount`、`componentDidUpdate` 的调用阶段是一样的。可以使用它来读取 DOM 布局并同步触发重渲染(render)。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。
`useEffect` ：传给 `useEffect` 的函数会延迟到在浏览器完成布局与绘制之后调用，但会保证在任何新的渲染前执行。React 将在组件更新前刷新上一轮渲染的 effect。
大概的执行顺序如下：
同步执行 js（也可能异步）-> 生成 VDom -> 挂载真实 DOM -> 执行 `useLayoutEffect` 的 effect -> 浏览器布局和绘制 -> 执行 `useEffect` 的 effect(会在下一个事件循环执行)

## useDebugValue

```js
useDebugValue(value);
```

`useDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的标签。
使用示例：

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

### 延迟格式化 debug 值

```js
useDebugValue(date, (date) => date.toDateString());
```

`useDebugValue` 接受一个格式化函数作为可选的第二个参数。该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。
个人理解就是避免这样使用 `useDebugValue`：

```js
useDebugValue(date.toDateString());
```

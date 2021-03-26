> MDN:https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

我们假定用户正面向（浏览器）视窗或网页，而 HTML 元素沿着其相对于用户的一条虚构的 z 轴排开，层叠上下文就是对这些 HTML 元素的一个三维构想。众 HTML 元素基于其元素属性按照优先级顺序占据这个空间。

文档中的层叠上下文由满足以下任意一个条件的元素形成：

- 文档根元素（<html>）；
- `position` 值为 `absolute`（绝对定位）或 `relative`（相对定位）且 `z-index` 值不为 `auto` 的元素；
- `position` 值为 `fixed`（固定定位）或 `sticky`（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
- `flex` (`flexbox`) 容器的子元素，且 `z-index` 值不为 `auto`；
- `grid` (`grid`) 容器的子元素，且 `z-index` 值不为 `auto`；
- `opacity` 属性值小于 1 的元素（参见 [the specification for opacity](http://www.w3.org/TR/css3-color/#transparency)）；
- `mix-blend-mode` 属性值不为 `normal` 的元素；
- 以下任意属性值不为 `none` 的元素：
  - `transform`
  - `filter`
  - `perspective`
  - `clip-path`
  - `mask` / `mask-image` / `mask-border`
- `isolation` 属性值为 `isolate` 的元素；
- `-webkit-overflow-scrolling` 属性值为 `touch` 的元素；
- `will-change` 值设定了任一属性而该属性在 `non-initial` 值时会创建层叠上下文的元素（参考[这篇文章](http://dev.opera.com/articles/css-will-change-property/)）；
- `contain` 属性值为 `layout`、`paint` 或包含它们其中之一的合成值（比如 `contain: strict`、`contain: content`）的元素。

在层叠上下文中，子元素同样也按照上面解释的规则进行层叠。 重要的是，其子级层叠上下文的 z-index 值只在父级中才有意义。子级层叠上下文被自动视为父级层叠上下文的一个独立单元。

总结：
层叠上下文可以包含在其他层叠上下文中，并且一起创建一个层叠上下文的层级。
每个层叠上下文都完全独立于它的兄弟元素：当处理层叠时只考虑子元素。
每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

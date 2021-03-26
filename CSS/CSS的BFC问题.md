# 什么是 BFC

块格式化上下文（Block Formatting Context，BFC） 是 Web 页面的**可视 CSS 渲染**的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。  
下列方式会创建块格式化上下文：

- 根元素（`<html>`）
- 浮动元素（元素的 `float` 不是 `none`）
- 绝对定位元素（元素的 `position` 为 `absolute` 或 `fixed`）
- 行内块元素（元素的 `display` 为 `inline-block`）
- 表格单元格（元素的 `display` 为 `table-cell`，HTML 表格单元格默认为该值）
- 表格标题（元素的 `display` 为 `table-caption`，HTML 表格标题默认为该值）
- 匿名表格单元格元素（元素的 `display` 为 `table`、`table-row`、 `table-row-group`、`table-header-group`、`table-footer-group`（分别是 HTML table、row、tbody、thead、tfoot 的默认属性）或 `inline-table`）
- `overflow` 计算值(Computed)不为 `visible` 的块元素
- `display` 值为 `flow-root` 的元素
- contain 值为 `layout`、`content` 或 `paint` 的元素
- 弹性元素（`display` 为 `flex` 或 `inline-flex` 元素的直接子元素）
- 网格元素（`display` 为 `grid` 或 `inline-grid` 元素的直接子元素）
- 多列容器（元素的 `column-count` 或 `column-width` 不为 `auto`，包括 `column-count` 为 1）
- `column-span` 为 `all` 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中。

块格式化上下文包含创建它的元素内部的所有内容。

块格式化上下文对浮动定位（`float`）与清除浮动（`clear`）都很重要。浮动定位和清除浮动时只会应用于同一个 BFC 内的元素。浮动不会影响其它 BFC 中元素的布局，而清除浮动只能清除同一 BFC 中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一 BFC 的块级元素之间。

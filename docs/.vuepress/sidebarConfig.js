const sidebar = {
  '/front-end/': [
    {
      title: 'JavaScript', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        '/front-end/03.Javascript/01.数据类型.md',
        '/front-end/03.Javascript/02.存储空间和垃圾回收.md',
        '/front-end/03.Javascript/11.原型和原型链.md',
        '/front-end/03.Javascript/03.执行上下文、作用域、闭包.md',
        '/front-end/03.Javascript/04.this的指向.md',
        '/front-end/03.Javascript/05.new的过程.md',
        '/front-end/03.Javascript/06.EventLoop.md',
        '/front-end/03.Javascript/07.DOM事件.md',
        '/front-end/03.Javascript/08.property与遍历.md',
        '/front-end/03.Javascript/09.块级作用域.md',
        '/front-end/03.Javascript/10.Set和Map数据结构.md',
        '/front-end/03.Javascript/51.数字计算处理常见函数.md'
      ]
    },
    {
      title: 'CSS', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/02.CSS/01.浮动布局与清除浮动.md',
        '/front-end/02.CSS/02.外边距折叠.md',
        '/front-end/02.CSS/03.CSS层叠上下文.md',
        '/front-end/02.CSS/04.CSS的BFC问题.md',
        '/front-end/02.CSS/05.CSS优先级.md'
      ]
    },
    {
      title: '专题系列', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        '/front-end/09.专题系列/01.节流和防抖.md',
        '/front-end/09.专题系列/02.浅深拷贝.md',
        '/front-end/09.专题系列/03.按需加载.md',
        '/front-end/09.专题系列/04.图片懒加载.md',
        '/front-end/09.专题系列/05.Tree-Shaking.md'
      ]
    },
    {
      title: 'React', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/12.React/useMemo.md',
        '/front-end/12.React/React Hooks.md',
        '/front-end/12.React/React更新与优化.md'
      ]
    },
    {
      title: 'git', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/10.git/git命令.md',
        '/front-end/10.git/commit规范.md'
      ]
    },
    {
      title: '移动端', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/15.移动端/01.移动端1px问题.md'
      ]
    },
    {
      title: '前端性能优化', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/08.前端性能优化/01.开篇.md',
        '/front-end/08.前端性能优化/02.网络层—网络优化.md',
        '/front-end/08.前端性能优化/03.网络层—资源优化.md',
        '/front-end/08.前端性能优化/04.图片质量与性能优化.md',
        '/front-end/08.前端性能优化/05.构建速度优化.md',
        '/front-end/08.前端性能优化/06.HTTP压缩之gzip压缩.md',
        '/front-end/08.前端性能优化/07.HTTP缓存.md',
        '/front-end/08.前端性能优化/08.本地储存.md',
        '/front-end/08.前端性能优化/09.CDN缓存与回源.md',
        '/front-end/08.前端性能优化/10.服务端渲染.md'
      ]
    },
    {
      title: 'network', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/06.网络协议/01.HTTP1.md',
        '/front-end/06.网络协议/02.HTTP2.md'
      ]
    },
    {
      title: '其他', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        '/front-end/14.其他/01.像素与分辨率.md',
        '/front-end/14.其他/02.设备像素、CSS像素、viewport.md',
        { title: 'Markdown语法简要', path: '/front-end/14.其他/Markdown语法简要.md' }
      ]
    }
  ],
  '/webpack/': ['/webpack/热更新hmr.md'],
  '/algorithm/': [
    {
      title: '数组和字符串',
      collapsable: false,
      children: [
        // prettier-ignore
        '/algorithm/1.数组和字符串/1.数组简介.md',
        '/algorithm/1.数组和字符串/2.二维数组简介.md',
        '/algorithm/1.数组和字符串/3.字符串简介.md'
      ]
    },
    {
      title: '队列&栈',
      collapsable: false,
      children: [
        // prettier-ignore
        '/algorithm/2.队列&栈/1.队列.md',
        '/algorithm/2.队列&栈/2.BFS.md',
        '/algorithm/2.队列&栈/3.栈.md',
        '/algorithm/2.队列&栈/4.DFS.md'
      ]
    },
    {
      title: '链表',
      collapsable: false,
      children: [
        // prettier-ignore
        '/algorithm/3.链表/1.单链表.md',
        '/algorithm/3.链表/2.双指针技巧.md',
        '/algorithm/3.链表/3.金典问题.md',
        '/algorithm/3.链表/4.双链表.md',
        '/algorithm/3.链表/5.小结.md'
      ]
    }
  ],
  '/interview/': [
    {
      title: '红绿灯', // 必要的
      path: '/interview/trafficlight.md'
    },
    '/interview/useFetch.md',
    '/interview/promiseA+.md',
    '/interview/add(1)(2)(3).md',
    '/interview/scheduler类.md',
    '/interview/封装重试函数.md',
    '/interview/数组去重.md',
    '/interview/数组扁平化.md',
    '/interview/_.get.md',
    '/interview/生成验证码.md',
    '/interview/实现trim方法.md',
    '/interview/compareVersion'
  ],
  '/node/': ['/node/'],
  '/computer-base/': [
    {
      title: '计算机基础',
      collapsable: false,
      children: [
        // prettier-ignore
        '/computer-base/比特、位数、字节.md',
        '/computer-base/IEEE754浮点数运算标准.md'
      ]
    }
  ],
  '/book/': [
    {
      title: '阮一峰ES6入门',
      collapsable: false,
      children: [
        // prettier-ignore
        '/book/01.阮一峰ES6/02.let和const命令.md'
      ]
    }
  ],
  '/life/': ['/life/']
};

module.exports = { sidebar };

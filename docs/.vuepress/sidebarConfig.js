const sidebar = {
  '/front-end/': [
    {
      title: 'JavaScript', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        '/front-end/03.Javascript/01.数据类型.md',
        '/front-end/03.Javascript/02.存储空间和垃圾回收.md',
        '/front-end/03.Javascript/03.执行上下文、作用域、闭包.md',
        '/front-end/03.Javascript/04.this的指向.md',
        '/front-end/03.Javascript/05.new的过程.md',
        '/front-end/03.Javascript/06.EventLoop.md',
        '/front-end/03.Javascript/07.事件.md',
        '/front-end/03.Javascript/08.prototype与遍历.md',
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
        '/front-end/02.CSS/04.CSS的BFC问题.md'
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
        '/front-end/10.git/git命令.md'
      ]
    },
    {
      title: '其他', // 必要的
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        // prettier-ignore
        {title:'Markdown语法简要',path:'/front-end/14.其他/Markdown语法简要.md'}
      ]
    }
  ],
  '/webpack/': ['/webpack/'],
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
    '/interview/数组扁平化.md'
  ],
  '/node/': ['/node/'],
  '/reading-and-life/': ['/reading-and-life/'],
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
  ]
};

module.exports = { sidebar };
const sidebarConfig = require('./sidebarConfig.js');
module.exports = {
  title: 'lazyken',
  description: '日积跬步，足以致千里！',
  base: '/blog/',
  themeConfig: {
    repo: 'lazyken/blog',
    nav: [
      { text: '前端', link: '/front-end/03.Javascript/01.数据类型.md' },
      { text: '数据结构与算法', link: '/algorithm/1.数组和字符串/1.数组简介.md' },
      { text: '编程题', link: '/interview/trafficlight.md' },
      {
        text: '更多',
        items: [
          { text: 'webpack', link: '/webpack/热更新hmr.md' },
          { text: 'Node', link: '/node/' },
          { text: '计算机基础', link: '/computer-base/比特、位数、字节.md' },
          { text: '技术书籍', link: '/book/01.阮一峰ES6/02.let和const命令.md' },
          { text: '生活随记', link: '/life/' }
        ]
      }
    ],
    sidebar: sidebarConfig.sidebar,
    search: true,
    searchMaxSuggestions: 10
  }
};

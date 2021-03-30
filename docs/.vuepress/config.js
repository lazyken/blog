const sidebarConfig = require('./sidebarConfig.js');
module.exports = {
  title: 'zxy',
  description: '日积跬步，足以致千里！',
  repo: 'lazyken/blog',
  repoLabel: 'Github',
  themeConfig: {
    nav: [
      { text: '前端', link: '/front-end/03.Javascript/01.数据类型.md' },
      { text: '数据结构与算法', link: '/algorithm/1.数组和字符串/1.数组简介.md' },
      { text: '编程题', link: '/interview/trafficlight.md' },
      { text: 'webpack', link: '/webpack/' },
      { text: 'Node', link: '/node/' },
      { text: '计算机基础', link: '/computer-base/比特、位数、字节.md' },
      { text: '读书与生活', link: '/reading-and-life/' }
    ],
    sidebar: sidebarConfig.sidebar,
    search: true,
    searchMaxSuggestions: 10
  }
};

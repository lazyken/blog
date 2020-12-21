本文摘抄自[https://zhuanlan.zhihu.com/p/24764131](https://zhuanlan.zhihu.com/p/24764131)，侵删。

## 简介

gzip 是 GNUzip 的缩写，最早用于 UNIX 系统的文件压缩。HTTP 协议上的 gzip 编码是一种用来改进 web 应用程序性能的技术，web 服务器和客户端（浏览器）必须共同支持 gzip。目前主流的浏览器，Chrome,firefox,IE 等都支持该协议。常见的服务器如 Apache，Nginx，IIS 同样支持 gzip。

gzip 压缩比率在 3 到 10 倍左右，可以大大节省服务器的网络带宽。而在实际应用中，并不是对所有文件进行压缩，通常只是压缩静态文件。

> HTTP 压缩是一种内置到网页服务器和网页客户端中以改进传输速度和带宽利用率的方式。在使用 HTTP 压缩的情况下，HTTP 数据在从服务器发送前就已压缩：兼容的浏览器将在下载所需的格式前宣告支持何种方法给服务器；不支持压缩方法的浏览器将下载未经压缩的数据。最常见的压缩方案包括 Gzip 和 Deflate。

## 在 web 中的使用

在 web 应用中开启 gzip 压缩需要客户端和服务端都支持 gzip 压缩才行。通常的步骤如下：  
1、浏览器请求 url，并在 `request header` 中设置属性 `accept-encoding:gzip`。表明浏览器支持 gzip。  
2、服务器收到浏览器发送的请求之后，判断浏览器是否支持 gzip，如果支持 gzip，则向浏览器传送压缩过的内容，不支持则向浏览器发送未经压缩的内容。一般情况下，浏览器和服务器都支持 gzip，`response headers` 返回包含 `content-encoding:gzip`。  
3、浏览器接收到服务器的响应之后判断内容是否被压缩，如果被压缩则解压缩显示页面内容。

## 在 Nginx 中开启 gzip

在企业级应用中，通常被使用到的服务器有 nginx，Apache 等。nginx 是一个高性能的 HTTP 和反向代理服务器，本文接下来的内容会介绍一下在 Nginx 中如何开启 gzip。  
在 Nginx 进行如下配置开启 gzip 压缩  
![gzip参数](https://pic3.zhimg.com/80/v2-b6b639c4fe1550e91368c75e73f8543e_1440w.png)
添加完参数后，运行 nginx –t 检查一下语法，若语法检测通过，则开始访问 url 检测 gzip 是否添加成功。以下为我所使用的 gzip 配置的作用。

- `gzip on`：开启 gzip。
- `gzip_comp_level`：gzip 压缩比。
- `gzip_min_length`：允许被压缩的页面最小字节数。
- `gzip_types`：匹配 MIME 类型进行压缩，text/html 默认被压缩。

### 推荐阅读：

1、[How To Optimize Your Site With GZIP Compression](https://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/)

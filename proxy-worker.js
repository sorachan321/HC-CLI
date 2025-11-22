
export default {
  async fetch(request, env, ctx) {
    // 目标 WebSocket 地址
    const targetUrl = "wss://hack.chat/chat-ws";

    // 1. 检查是否为 WebSocket 请求
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Hack.Chat Proxy Node is Running.\nPlease connect via a WebSocket client.', { status: 200 });
    }

    // 2. 构建新的请求头 (关键修正)
    // 不能直接复制 request.headers，否则会带上 worker 的 Host，导致对方拒绝
    const newHeaders = new Headers();

    // 只复制 WebSocket 握手必须的头
    const headersToCopy = [
      'Upgrade',
      'Connection',
      'Sec-WebSocket-Key',
      'Sec-WebSocket-Version',
      'Sec-WebSocket-Extensions',
      'Sec-WebSocket-Protocol'
    ];

    for (const headerName of headersToCopy) {
      const value = request.headers.get(headerName);
      if (value) {
        newHeaders.set(headerName, value);
      }
    }

    // 3. 深度伪装
    newHeaders.set('Host', 'hack.chat');                 // 告诉服务器我们访问的是 hack.chat
    newHeaders.set('Origin', 'https://hack.chat');       // 告诉服务器我们来自官方网站
    newHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'); // 伪装成浏览器

    // 4. 发起转发
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: newHeaders,
      });

      // 返回上游服务器的响应 (101 Switching Protocols)
      return response;
    } catch (e) {
      return new Response(`Proxy Error: ${e.message}`, { status: 500 });
    }
  },
};

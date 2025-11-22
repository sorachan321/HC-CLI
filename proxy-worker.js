
export default {
  async fetch(request, env, ctx) {
    // 目标 WebSocket 地址
    // 注意：在 Cloudflare Worker fetch 中，必须使用 https:// 协议头来触发 WebSocket 升级，
    // 不能直接写 wss://，否则会报错导致 502。
    const targetUrl = "https://hack.chat/chat-ws";

    // 1. 检查是否为 WebSocket 请求
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Hack.Chat Proxy Node is Running.\nPlease connect via a WebSocket client.', { status: 200 });
    }

    // 2. 构建新的请求头
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

    // 3. 关键伪装：Origin
    // Hack.chat 服务器检查这个来防止跨站连接
    newHeaders.set('Origin', 'https://hack.chat');
    newHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 4. 发起转发
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: newHeaders,
      });

      return response;
    } catch (e) {
      // 如果 fetch 失败，返回 502 Bad Gateway
      return new Response(`Proxy Error: ${e.message}`, { status: 502 });
    }
  },
};

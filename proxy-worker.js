
export default {
  async fetch(request, env, ctx) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Hack.Chat Proxy Node is Running.\nPlease connect via a WebSocket client.', { status: 200 });
    }

    // 1. 定义目标 URL (使用 https 协议触发 Cloudflare 的 WS 升级)
    const targetUrl = "https://hack.chat/chat-ws";

    // 2. 克隆原始请求，保留所有浏览器生成的 WebSocket 握手头 (Sec-WebSocket-Key 等)
    // 这一步比手动复制 Header 更安全、更兼容
    const proxyRequest = new Request(targetUrl, request);

    // 3. 伪装 Origin，骗过服务器的跨站检查
    proxyRequest.headers.set('Origin', 'https://hack.chat');
    
    // 4. 设置 User-Agent (可选，模拟浏览器)
    proxyRequest.headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
      // 5. 转发请求
      const response = await fetch(proxyRequest);
      return response;
    } catch (e) {
      return new Response(`Proxy Error: ${e.message}`, { status: 502 });
    }
  },
};

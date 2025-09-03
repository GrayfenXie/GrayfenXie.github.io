// api/log.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  // 推送到企业微信机器人
  await fetch(
    process.env.WX_WEBHOOK,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'text',
        text: {
          content:
            `📍 访问提醒\n` +
            `IP：${ip}\n` +
            `UA：${ua}\n` +
            `时间：${new Date().toLocaleString('zh-CN')}`,
        },
      }),
    }
  );
  return new Response('ok', { status: 200 });
}
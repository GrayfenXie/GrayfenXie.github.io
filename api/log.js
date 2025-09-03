// api/log.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  // 取 IP 和 UA
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  // 1) 线上自动用 https://<VERCEL_URL>
  // 2) 本地用 http://localhost:3000
  const base = process.env.VERCEL_URL?.startsWith('localhost')
    ? 'http://localhost:3000' // 本地 vercel dev
    : `https://${process.env.VERCEL_URL}`; // 线上

  // 调用 Node 邮件函数
  await fetch(
    `${base}/api/sendmail?ip=${encodeURIComponent(
      ip
    )}&ua=${encodeURIComponent(ua)}`
  );

  return new Response('ok', { status: 200 });
}
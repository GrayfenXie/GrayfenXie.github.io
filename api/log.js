// api/log.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  // 调用上面的 Node 函数
  await fetch(
    `${process.env.VERCEL_URL}/api/sendmail?ip=${encodeURIComponent(
      ip
    )}&ua=${encodeURIComponent(ua)}`
  );

  return new Response('ok', { status: 200 });
}
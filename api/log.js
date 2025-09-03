// api/log.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  // 过滤爬虫
  if (/vercel-screenshot|bot|spider|crawl/i.test(ua)) {
    return new Response('bot ignored', { status: 200 });
  }

  try {
    const base = 'https://www.grayfen.cn';
    console.log('calling wxsend at', `${base}/api/wxsend`);
    await fetch(`${base}/api/wxsend?ip=${encodeURIComponent(ip)}&ua=${encodeURIComponent(ua)}`);
  } catch (e) {
    console.warn('wx push failed', e);
  }

  return new Response('ok', { status: 200 });
}
// api/log.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  // // 调用微信测试号推送
  // const base = process.env.VERCEL_URL?.startsWith('localhost')
  //   ? 'http://localhost:3000'
  //   : `https://${process.env.VERCEL_URL}`;
  // await fetch(`${base}/api/wxsend?ip=${encodeURIComponent(ip)}&ua=${encodeURIComponent(ua)}`);
  try {
    // const base = process.env.VERCEL_URL?.includes('localhost')
    //   ? 'http://localhost:3000'
    //   : `https://${process.env.VERCEL_URL}`;
    const base = 'https://www.grayfen.cn';
    console.log('calling wxsend at', `${base}/api/wxsend`);
    await fetch(`${base}/api/wxsend?ip=${encodeURIComponent(ip)}&ua=${encodeURIComponent(ua)}`);
  } catch (e) {
    console.warn('wx push failed', e);
  }

  return new Response('ok', { status: 200 });
}
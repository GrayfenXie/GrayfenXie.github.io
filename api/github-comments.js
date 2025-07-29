// /api/github-comments.js
export default async function handler(req, res) {
  const owner = 'GrayfenXie';
  const repo  = 'GrayfenXie.github.io';

  try {
    const apiRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/comments?per_page=100&sort=created`
    );
    if (!apiRes.ok) throw new Error(apiRes.statusText);

    const data = await apiRes.json();
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=600'); // 10 分钟缓存
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// api/wxsend.js  (Vercel Node Runtime)
const axios = require('axios');

//获取微信 access_token
const getAccessToken = async () => {
  const { data } = await axios.get(
    'https://api.weixin.qq.com/cgi-bin/token',
    {
      params: {
        grant_type: 'client_credential',
        appid: process.env.WX_APP_ID,
        secret: process.env.WX_APP_SECRET,
      },
    }
  );
  if (!data.access_token) {
    throw new Error('getAccessToken failed: ' + JSON.stringify(data));
  }
  return data.access_token;
};

//根据 IP 查归属地（含运营商）
const getIpGeo = async (ip) => {
  try {
    const url =
      'https://apis.map.qq.com/ws/location/v1/ip' +
      `?ip=${encodeURIComponent(ip)}&key=${process.env.TX_MAP_KEY}`;
    const { data } = await axios.get(url);

    console.log('[getIpGeo] 腾讯返回：', JSON.stringify(data));

    if (data.status === 0) {
      const { nation, province, city, district } = data.result.ad_info;
      // 运营商在 district 字段，有时为空
      const isp = district && district !== city ? ` ${district}` : '';
      return `${nation} ${province} ${city}${isp}`.trim();
    }
    console.warn('[getIpGeo] status !== 0:', data.status, data.message);
  } catch (err) {
    console.error('[getIpGeo] 网络/异常错误：', err.message);
  }
  return '未知地区';
};

//3. Vercel Serverless 入口
module.exports = async function handler(req, res) {
  try {
    const { ip, ua } = req.query;
    if (!ip) return res.status(400).send('缺少 ip 参数');

    const geo = await getIpGeo(ip);
    const token = await getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;

    const chinatime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    await axios.post(url, {
      touser: process.env.WX_OPEN_ID,
      template_id: process.env.WX_TPL_ID,
      data: {
        first: { value: '有人访问了你的博客~' },
        ip: { value: ip },
        geo: { value: geo },
        ua: { value: ua || '' },
        time: { value: chinatime },
      },
    });

    res.status(200).send('wx sent');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
// api/wxsend.js  (Node Runtime)
const axios = require('axios');

const getAccessToken = async () => {
  const { data } = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.WX_APP_ID}&secret=${process.env.WX_APP_SECRET}`
  );
  if (!data.access_token) throw new Error('getAccessToken failed: ' + JSON.stringify(data));
  return data.access_token;
};


// 腾讯位置服务免费 IP 归属地（中文）
const getIpGeo = async (ip) => {
  try {
    const { data } = await axios.get(
      `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${process.env.TX_MAP_KEY}`
    );
    if (data.status === 0) {
      const { nation, province, city } = data.result.ad_info;
      const isp = data.result.ad_info.district || ''; // 运营商字段
      return `${nation} ${province} ${city} ${isp}`.trim();
    }
  } catch {
    /* ignore */
  }
  return '未知地区';
};

module.exports = async function handler(req, res) {
  try {
    const { ip, ua } = req.query;
    const geo = await getIpGeo(ip);          // ← 新增
    const token = await getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;
    const chinatime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    await axios.post(url, {
      touser: process.env.WX_OPEN_ID,
      template_id: process.env.WX_TPL_ID,
      data: {
        first: { value: '有人访问了你的博客~', color: '#173177' },
        ip: { value: ip, color: '#173177' },
        geo: { value: geo, color: '#173177' }, // ← 模板里加 {{geo.DATA}}
        ua: { value: ua, color: '#173177' },
        time: { value: chinatime, color: '#173177' },
      },
    });
    res.status(200).send('wx sent');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
// api/wxsend.js  (Node Runtime)
const axios = require('axios');

const getAccessToken = async () => {
  const { data } = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.WX_APP_ID}&secret=${process.env.WX_APP_SECRET}`
  );
  return data.access_token;
};

module.exports = async function handler(req, res) {
  const { ip, ua } = req.query;
  const token = await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;
  await axios.post(url, {
    touser: process.env.WX_OPEN_ID,
    template_id: process.env.WX_TPL_ID,
    data: {
      ip: { value: ip, color: '#173177' },
      ua: { value: ua, color: '#173177' },
      time: { value: new Date().toLocaleString('zh-CN'), color: '#173177' },
    },
  });
  res.status(200).send('wx sent');
};
// api/sendmail.js
import * as nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { ip, ua } = req.query;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    subject: 'grayfen.cn 访问提醒',
    text: `IP: ${ip}\nUA: ${ua}\n时间: ${new Date().toLocaleString('zh-CN')}`,
  });

  res.status(200).send('sent');
}
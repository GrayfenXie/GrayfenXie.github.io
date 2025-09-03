// api/sendmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const { ip, ua } = req.query;
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,                 // 465 用 true
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    subject: 'grayfen.cn 访问提醒',
    text: `IP: ${ip}\nUA: ${ua}\n时间: ${new Date().toLocaleString('zh-CN')}`,
  });

  res.status(200).send('sent');
}
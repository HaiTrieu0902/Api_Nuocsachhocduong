import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { SYSTEM_NOTIFICATION } from '../constant';
dotenv.config();
export const tranporter = nodemailer?.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_HOST_ADDRES,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const mailerOptions = (tokenEmail: string, email: string, user: string, host: any) => {
  return {
    from: `NuocSachHocDuong ${process.env.MAIL_HOST_ADDRES}`,
    to: email,
    subject: '[Verify email to continue with the registration step]',
    html: `<h2>${user}! Thanks for resister on our site</h2>
        <h4>Please check you mail to continue...</h4>
        <a href="http://${host}/auth/verify-email?token=${tokenEmail}">Verify this here</a>`,
  };
};

export const mailerCheckOTP = (email: string, user: string, OTP: string | number) => {
  const mailOption = {
    from: `NuocSachHocDuong ${process.env.MAIL_HOST_ADDRES}`,
    to: email,
    subject: '[MÃ OTP XÁC NHẬN QUÊN MẬT KHẨU]',
    html: `<div>Code OTP: <b>${OTP}</b>
      <div><p>Không chia sẻ nó với bất kỳ ai</p></div>
      </div>`,
  };
  tranporter.sendMail(mailOption, function (err, info) {
    if (err) {
      console.log(err);
      return err;
    } else {
      return SYSTEM_NOTIFICATION.NOTIFICATION_SENDOTP;
    }
  });
};

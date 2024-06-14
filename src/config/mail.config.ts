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
    from: `Nước sạch học đường <${process.env.MAIL_HOST_ADDRES}>`,
    to: email,
    subject: '[MÃ OTP XÁC NHẬN QUÊN MẬT KHẨU]',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://nuocsachhocduong.com/wp-content/uploads/2022/03/z3232669649183_e4abece3a56919bb5c748edd18f2cd16.jpg" alt="Nuoc Sach Hoc Duong" style="max-width: auto; height: 200px;">
        </div>
        <h2 style="color: #333;">Xin chào ${user},</h2>
        <p>Để xác nhận quên mật khẩu, vui lòng sử dụng mã OTP sau:</p>
        <div style="font-size: 24px; font-weight: bold; color: #ff0000; margin: 20px 0;">${OTP}</div>
        <p style="color: #555;">Không chia sẻ mã này với bất kỳ ai. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Nước sạch học đường</p>
      </div>
    `,
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

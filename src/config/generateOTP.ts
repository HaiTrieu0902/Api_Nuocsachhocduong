import dotenv from 'dotenv';
import * as OTPAuth from 'otpauth';
dotenv.config();
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Hex from 'crypto-js/enc-hex';

const OtpConfig = {
  /* Client */
  generateOTPAuth: async (email: string) => {
    // const hashDigest = sha256(email);
    // const hmacDigest = Hex.stringify(hmacSHA512(hashDigest, process.env.OTP_SECRET as string));
    const totp = new OTPAuth.TOTP({
      issuer: process.env.OTP_ISSUER as string,
      label: email,
      algorithm: process.env.OTP_ALGORITHM as string,
      digits: 6,
      period: 120,
      secret: process.env.OTP_SECRET,
    });
    const token = totp.generate();
    return token;
  },
  verifyOTP: async (email: string, otp: string): Promise<any> => {
    // const hashDigest = sha256(email);
    // const hmacDigest = Hex.stringify(hmacSHA512(hashDigest, process.env.OTP_SECRET as string));
    try {
      const totp = new OTPAuth.TOTP({
        issuer: process.env.OTP_ISSUER as string,
        label: email,
        algorithm: process.env.OTP_ALGORITHM as string,
        digits: 6,
        period: 120,
        secret: process.env.OTP_SECRET,
      });
      const isOTPValid = totp.validate({ token: otp, window: 1 });
      return isOTPValid;
    } catch (error) {
      return false;
    }
  },
};
// Khi tạo sẽ gửi OTp vào user email đó mã OTP
// Tạo thêm một trường OtpSendPass
// check xem đúng không , nếu thay đổi mật khẩu thành công set OtpSendPass là null
export default OtpConfig;

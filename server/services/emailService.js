const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Registration OTP
const sendVerificationOTP = async (email, otp) => {
  const mailOptions = {
    from: `"AyurvedaMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'AyurvedaMart - Verify Your Email',
    text: `Your AyurvedaMart verification OTP is ${otp}. This OTP is valid for 5 minutes. Do not share this OTP with anyone.`,
    html: `
      <div style="margin:0;padding:30px;background:#f7f2e8;font-family:Arial,sans-serif;">
        <div style="max-width:500px;margin:auto;background:#fffdf8;border:1px solid #eae1d2;border-radius:18px;padding:30px;">
          <div style="text-align:center;">
            <h1 style="margin:0;color:#123d2a;font-size:28px;">AyurvedaMart</h1>
            <p style="color:#7a6248;font-size:14px;">
              Authentic Ayurveda. Natural Wellness.
            </p>
          </div>

          <hr style="border:none;border-top:1px solid #eae1d2;margin:25px 0;" />

          <h2 style="color:#123d2a;font-size:20px;">
            Verify Your Email
          </h2>

          <p style="color:#243229;font-size:14px;line-height:1.6;">
            Please use the OTP below to verify your email address
            and complete your AyurvedaMart registration.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <div style="
              display:inline-block;
              padding:15px 30px;
              background:#123d2a;
              color:#ffffff;
              border-radius:12px;
              font-size:30px;
              font-weight:bold;
              letter-spacing:8px;
            ">
              ${otp}
            </div>
          </div>

          <p style="color:#7a6248;font-size:13px;text-align:center;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p style="color:#7a6248;font-size:12px;margin-top:25px;">
            If you did not try to create an AyurvedaMart account,
            you can safely ignore this email.
          </p>

          <hr style="border:none;border-top:1px solid #eae1d2;margin:25px 0;" />

          <p style="color:#7a6248;font-size:11px;text-align:center;">
            © ${new Date().getFullYear()} AyurvedaMart
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Password Reset OTP
const sendPasswordResetOTP = async (email, otp) => {
  const mailOptions = {
    from: `"AyurvedaMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'AyurvedaMart - Password Reset OTP',
    text: `Your AyurvedaMart password reset OTP is ${otp}. This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email.`,
    html: `
      <div style="margin:0;padding:30px;background:#f7f2e8;font-family:Arial,sans-serif;">
        <div style="max-width:500px;margin:auto;background:#fffdf8;border:1px solid #eae1d2;border-radius:18px;padding:30px;">

          <div style="text-align:center;">
            <h1 style="margin:0;color:#123d2a;font-size:28px;">
              AyurvedaMart
            </h1>

            <p style="color:#7a6248;font-size:14px;">
              Authentic Ayurveda. Natural Wellness.
            </p>
          </div>

          <hr style="border:none;border-top:1px solid #eae1d2;margin:25px 0;" />

          <h2 style="color:#123d2a;font-size:20px;">
            Reset Your Password
          </h2>

          <p style="color:#243229;font-size:14px;line-height:1.6;">
            We received a request to reset your AyurvedaMart account password.
            Use the OTP below to continue.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <div style="
              display:inline-block;
              padding:15px 30px;
              background:#123d2a;
              color:#ffffff;
              border-radius:12px;
              font-size:30px;
              font-weight:bold;
              letter-spacing:8px;
            ">
              ${otp}
            </div>
          </div>

          <p style="color:#7a6248;font-size:13px;text-align:center;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <div style="
            margin-top:25px;
            padding:15px;
            background:#f7f2e8;
            border-radius:12px;
          ">
            <p style="margin:0;color:#7a6248;font-size:12px;line-height:1.6;">
              If you did not request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </p>
          </div>

          <hr style="border:none;border-top:1px solid #eae1d2;margin:25px 0;" />

          <p style="color:#7a6248;font-size:11px;text-align:center;">
            © ${new Date().getFullYear()} AyurvedaMart
          </p>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationOTP,
  sendPasswordResetOTP,
};
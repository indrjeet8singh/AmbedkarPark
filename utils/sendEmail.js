import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log(
      "Sending OTP email to:",
      email
    );

    const transporter =
      nodemailer.createTransport({
        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    const info =
      await transporter.sendMail({
        from: `"Admin Verification" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "Admin Email Verification OTP",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 25px;
            border: 1px solid #ddd;
            border-radius: 10px;
          ">
            <h2>Admin Email Verification</h2>

            <p>Your verification OTP is:</p>

            <h1 style="
              letter-spacing: 8px;
              font-size: 32px;
            ">
              ${otp}
            </h1>

            <p>
              This OTP will expire in 10 minutes.
            </p>

            <p>
              Please do not share this OTP with anyone.
            </p>
          </div>
        `,
      });

    console.log(
      "Email sent successfully:",
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error.message
    );

    throw error;
  }
};
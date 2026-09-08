// import asyncHandler from "express-async-handler";
// import { User } from "../models/User.js";
// import { generateToken } from "../utils/generateToken.js";
// import { sendOTP } from "../utils/sendSMS.js";

// export const registerUser = asyncHandler(async (req, res) => {
//   const {
//     name,
//     mobile,
//     password,
//     role,
//   } = req.body;

//   if (!name || !mobile || !password) {
//     res.status(400);
//     throw new Error(
//       "Name, mobile number and password are required"
//     );
//   }

//   const cleanMobile = mobile.replace(/\D/g, "");

//   if (cleanMobile.length !== 10) {
//     res.status(400);
//     throw new Error(
//       "Please enter a valid 10 digit mobile number"
//     );
//   }

//   const userExists = await User.findOne({
//     mobile: cleanMobile,
//   });

//   if (userExists) {
//     res.status(400);
//     throw new Error(
//       "Mobile number already registered"
//     );
//   }

//   const userRole =
//     role === "admin" ? "admin" : "user";

//   const isVerified = userRole === "user";

//   const otp =
//     userRole === "admin"
//       ? Math.floor(
//           100000 + Math.random() * 900000
//         ).toString()
//       : null;

//   const otpExpire =
//     userRole === "admin"
//       ? new Date(Date.now() + 10 * 60 * 1000)
//       : null;

//   const user = await User.create({
//     name,
//     mobile: cleanMobile,
//     password,
//     role: userRole,
//     isMobileVerified: isVerified,
//     otp,
//     otpExpire,
//   });

//   // Admin ke liye OTP SMS
//   if (userRole === "admin") {
//     await sendOTP(
//       `91${cleanMobile}`,
//       otp
//     );
//   }

//   res.status(201).json({
//     success: true,

//     message:
//       userRole === "admin"
//         ? "OTP sent to your mobile number"
//         : "Registration successful",

//     user: {
//       _id: user._id,
//       name: user.name,
//       mobile: user.mobile,
//       role: user.role,
//       isMobileVerified:
//         user.isMobileVerified,
//     },
//   });
// });


// export const verifyOTP = asyncHandler(
//   async (req, res) => {
//     const { mobile, otp } = req.body;

//     if (!mobile || !otp) {
//       res.status(400);
//       throw new Error(
//         "Mobile number and OTP are required"
//       );
//     }

//     const cleanMobile =
//       mobile.replace(/\D/g, "");

//     const user = await User.findOne({
//       mobile: cleanMobile,
//     });

//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

//     if (user.role !== "admin") {
//       res.status(400);
//       throw new Error(
//         "OTP verification is only for admin"
//       );
//     }

//     if (user.isMobileVerified) {
//       res.status(400);
//       throw new Error(
//         "Mobile number already verified"
//       );
//     }

//     if (!user.otp) {
//       res.status(400);
//       throw new Error(
//         "OTP not found. Please resend OTP"
//       );
//     }

//     if (user.otp !== otp) {
//       res.status(400);
//       throw new Error("Invalid OTP");
//     }

//     if (
//       !user.otpExpire ||
//       user.otpExpire < new Date()
//     ) {
//       res.status(400);
//       throw new Error("OTP has expired");
//     }

//     user.isMobileVerified = true;
//     user.otp = null;
//     user.otpExpire = null;

//     await user.save();

//     res.json({
//       success: true,
//       message:
//         "Mobile number verified successfully",
//     });
//   }
// );

// // controllers/authController.js

// import asyncHandler from "express-async-handler";
// import { User } from "../models/User.js";
// import { sendOTP } from "../utils/sendSMS.js";

// export const resendOTP = asyncHandler(async (req, res) => {
//   const { mobile } = req.body;

//   if (!mobile) {
//     res.status(400);
//     throw new Error("Mobile number is required");
//   }

//   const user = await User.findOne({ mobile });

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   // 6 digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // OTP 5 minutes तक valid
//   user.otp = otp;
//   user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

//   await user.save();

//   // SMS भेजें
//   await sendOTP(mobile, otp);

//   res.status(200).json({
//     success: true,
//     message: "OTP resent successfully",
//   });
// });




import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

// =========================
// REGISTER USER
// =========================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const cleanEmail = email.toLowerCase().trim();

  const userExists = await User.findOne({
    email: cleanEmail,
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Role
  const userRole = role === "admin" ? "admin" : "user";

  // Admin ke liye OTP
  const otp =
    userRole === "admin"
      ? Math.floor(
          100000 + Math.random() * 900000
        ).toString()
      : null;

  const otpExpire =
    userRole === "admin"
      ? new Date(Date.now() + 10 * 60 * 1000)
      : null;

  const user = await User.create({
    name,
    email: cleanEmail,
    password,
    role: userRole,

    // Normal user direct verified
    isEmailVerified: userRole === "user",

    otp,
    otpExpire,
  });

  // Admin ko Email OTP
  if (userRole === "admin") {
    await sendOTPEmail(user.email, otp);
  }

  res.status(201).json({
    success: true,

    message:
      userRole === "admin"
        ? "OTP sent to your email"
        : "Registration successful",

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  });
});


// =========================
// VERIFY OTP
// =========================
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: cleanEmail,
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role !== "admin") {
    res.status(400);
    throw new Error("OTP verification is only for admin");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email already verified");
  }

  if (!user.otp) {
    res.status(400);
    throw new Error("OTP not found. Please resend OTP");
  }

  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  if (
    !user.otpExpire ||
    user.otpExpire < new Date()
  ) {
    res.status(400);
    throw new Error("OTP has expired");
  }

  // Verify
  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpire = null;

  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});


// =========================
// RESEND OTP
// =========================
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: cleanEmail,
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role !== "admin") {
    res.status(400);
    throw new Error("OTP resend is only for admin");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  // New 6 digit OTP
  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // 10 minutes valid
  user.otp = otp;
  user.otpExpire = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  // Email par OTP bhejo
  await sendOTPEmail(user.email, otp);

  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});


// =========================
// LOGIN
// =========================
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error(
      "Email and password are required"
    );
  }

  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: cleanEmail,
  });

  if (
    !user ||
    !(await user.matchPassword(password))
  ) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Admin email verify check
  if (
    user.role === "admin" &&
    !user.isEmailVerified
  ) {
    res.status(403);
    throw new Error(
      "Please verify your email before login"
    );
  }

  const token = generateToken(user._id);

  res.json({
    success: true,

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});
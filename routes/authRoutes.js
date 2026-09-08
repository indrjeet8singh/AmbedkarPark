import express from "express";

import {
registerUser,
authUser,
verifyOTP,
resendOTP,
} from "../controllers/authController.js";

const router = express.Router();

router.post(
"/register",
registerUser
);

router.post(
"/login",
authUser
);

router.post(
"/verify-otp",
verifyOTP
);

router.post(
"/resend-otp",
resendOTP
);

export default router;

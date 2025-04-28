import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService.service.js";
import nodemailer from "nodemailer";
let refreshTokens = [];

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        role: req.body.role || "user",
      });

      // Save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(404).json({ message: "Wrong username" });
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(404).json({ message: "Wrong password" });

      if (user && validPassword) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        // eslint-disable-next-line no-unused-vars
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  // REQUEST REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json("You are not authenticated");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log("JWT Verify Error:", err);
        return res.status(403).json("Token is invalid");
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  },

  // LOGOUT

  logoutUser: async (req, res) => {
    const authHearder = req.headers.authorization;
    const accessToken = authHearder.split(" ")[1];

    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logout successfully");
  },
  senOTP: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "Email không tồn tại!" });
      const now = Date.now();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetOTP = otp;
      user.otpExpires = now + 2 * 60 * 1000;
      user.isVerifiedReset = false;
      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nontruong51@gmail.com",
          pass: "xnjjyvlxzlazrint",
        },
      });
      const expiresAt = new Date(user.otpExpires).toLocaleTimeString("vi-VN");

      await transporter.sendMail({
        from: "SmartNova",
        to: email,
        subject: "Mã OTP khôi phục mật khẩu",
        text: `Mã xác thực OTP của bạn là: ${otp}. Mã có hiệu lực đến ${expiresAt}`,
      });

      console.log(`gui  otp den${email} `, otp);
      res.status(200).json({
        message: "gui ma thanh cong",
      });
    } catch (error) {
      res.status(500).json("loi server" + error);
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (user.resetOTP !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "ma khong hop le" });
      }
      user.otpExpires = null;
      user.isVerifiedReset = true;
      user.resetOTP = null;
      await user.save();

      return res.status(200).json({ message: "xac thuc thanh cong" });
    } catch (error) {
      return res.status(500).json({ message: "ma khong hop le" + error });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      const user = await User.findOne({ email });
      if (!user || !user.isVerifiedReset)
        return res.status(403).json({ message: " chua xac minh otp" });
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "mat khau nhap  lai kh  khop!" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.isVerifiedReset = false;
      await user.save();
      return res.status(200).json({ message: "thay doi mat khau thanh cong" });
    } catch (error) {
      return res.status(500).json("loi roi" + error);
    }
  },
};

export default authController;

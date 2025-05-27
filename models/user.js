import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    images: {
      type: String, // link ảnh đại diện
    },
    role: {
      type: String,
      enum: ["user", "admin", "shipper" , "warehouse"],
      default: "user",
    },
    status: {
      type: String,
      default: "active", // hoặc suspended, deactivated, ...
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetOTP: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerifiedReset: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
    },
    emailVerifyExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

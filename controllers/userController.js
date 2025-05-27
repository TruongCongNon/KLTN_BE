import { getDefaultAvatar } from "../constants/user.constant.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
const userController = {
  // Lấy danh sách người dùng
  getAllUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit),
        User.countDocuments(),
      ]);

      res.json({
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        users,
      });
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
    }
  },

  // Lấy chi tiết 1 người dùng
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ error: "Không tìm thấy người dùng" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Tạo người dùng mới
  createUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      console.log("BODY ===>", req.body);
      console.log("PASSWORD ===>", req.body.password);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
        images: req.file
          ? `/assets/${req.file.filename}`
          : getDefaultAvatar(username),
      });

      const savedUser = await newUser.save();
      res.status(201).json({ user: savedUser });
    } catch (err) {
      res.status(400).json({ error: "Tạo người dùng thất bại" });
    }
  },

  //Cập nhật người dùng
  updateUser: async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id); // 🟢 Dùng đúng hàm để lấy user

    if (!existingUser) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    const { username, email, phone, address, role } = req.body;

    const updatedData = {
      username,
      email,
      phone,
      address,
      role,
      images: req.file
        ? `/assets/${req.file.filename}`
        : existingUser.images,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    res.status(500).json({ error: "Cập nhật thất bại" });
  }
},

  // Xóa người dùng
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ error: "Xóa thất bại" });
    }
  },

  // Block người dùng
  blockUser: async (req, res) => {
    try {
      const blockedUser = await User.findByIdAndUpdate(
        req.params.id,
        { isBlocked: true },
        { new: true }
      );
      res.json({ message: "Đã block người dùng", user: blockedUser });
    } catch (err) {
      res.status(500).json({ error: "Block thất bại" });
    }
  },

  // Unblock người dùng
  unblockUser: async (req, res) => {
    try {
      const unblockedUser = await User.findByIdAndUpdate(
        req.params.id,
        { isBlocked: false },
        { new: true }
      );
      res.json({ message: "Đã unblock người dùng", user: unblockedUser });
    } catch (err) {
      res.status(500).json({ error: "Unblock thất bại" });
    }
  },
};

export default userController;

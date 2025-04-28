import User from "../models/user.js";

const userController = {
  //get all user
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      return res.status(200).json(user); // all user
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const images = req.file ? `/assets/${req.file.filename}` : null;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, role, images },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Trả về người dùng đã được cập nhật
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  //delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Delete success");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
const user = userController;
export default user;

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
  //   updateUser: async (req, res) => {
  //     try {
  // const productId =  req.params.id;
  //       const user = await User.findByIdAndUpdate(
  // {
  //
  // });
  //       return res.status(200).json("Update Success");
  //     } catch (error) {
  //       return res.status(500).json("Update failed");
  //     }
  //   },
  //delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json("Delete success");
    } catch (error) {   
      return res.status(500).json(error);
    }
  },
};
const user = userController;
export default user;

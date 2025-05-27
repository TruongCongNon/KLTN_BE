import Cart from "../models/cart.js";
import mongoose from "mongoose";
const cartController = {
  getCart: async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findOne({ userId }).populate({path:"items.productId",model: 'Product'});
      return res.status(200).json(cart || { items: [] });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: err });
    }
  },

  addToCart: async (req, res) => {
    const { userId, productId, quantity, priceSale } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );
  
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].priceSale = priceSale; // ✅ luôn cập nhật giá hiện tại (sale hoặc gốc)
        } else {
          cart.items.push({ productId, quantity, priceSale });
        }
      } else {
        cart = new Cart({
          userId,
          items: [{ productId, quantity, priceSale }],
        });
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error: err });
    }
  },
  removeFromCart: async (req, res) => {
    const { userId, productId } = req.body;
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true } // Trả về giỏ hàng sau khi cập nhật
      );
  
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      // Xóa sản phẩm khỏi giỏ hàng
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
  
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
    }
  },

  clearCart: async (req, res) => {
    const { userId } = req.body;
    try {
      await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
      res.json({ message: "Giỏ hàng đã được làm trống" });
    } catch (error) {
      res.status(500).json({ error: "loi xoa gio hang" });
    }
  },
};
export default cartController;

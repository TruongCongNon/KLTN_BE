import Cart from "../models/cart.js";
import mongoose from "mongoose";
const cartController = {
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server", details: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;
      const { productId, name, price, quantity, image } = req.body.product;
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({
          userId,
          items: [{ productId, name, price, quantity, image }],
        });
      } else {
        const existingItem = cart.items.find(
          (item) => item.productId.toString() === productId
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, name, price, quantity, image });
        }
      }
      await cart.save();
      res.json({ success: true, cart });
    } catch (error) {
      // console.error("Lỗi khi thêm vào giỏ hàng:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  },
  removeFromCart: async (req, res) => {
    const { userId, productId } = req.body;
    try {
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        return res
          .status(400)
          .json({ error: "userId hoặc productId không hợp lệ" });
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (itemIndex === -1) {
        return res
          .status(404)
          .json({ error: "Sản phẩm không tồn tại trong giỏ hàng" });
      }

      cart.items.splice(itemIndex, 1);
      cart.totalQuantity =
        cart.items.length > 0
          ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : 0;
      cart.totalPrice =
        cart.items.length > 0
          ? cart.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
          : 0;
      await cart.save();
      res.json({ message: "Xóa sản phẩm thành công", cart });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Lỗi xóa sản phẩm giỏ hàng", details: error.message });
    }
  },

  clearCart: async (req, res) => {
    const { userId } = req.body;
    // console.log("=>" + userId);
    try {
      const cartDeleted = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalQuantity: 0, totalPrice: 0 } },
        { new: true }
      );

      res.status(200).json(cartDeleted);
    } catch (error) {
      res.status(500).json({ error: "loi xoa gio hang" });
    }
  },
};
export default cartController;

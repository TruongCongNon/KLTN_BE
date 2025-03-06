import Cart from "../models/cart.js";

const cartController = {
  addToCart: async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;
      const { productId, name, price, quantity, image } = req.body.product; 
      let cart = await Cart.findOne({ userId });
      console.log(cart);
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
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  },
  removeFromCart: async (req, res) => {
    const { userId, productId } = req.body;
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ error: " gio hang kh co " });
      cart.items = cart.items.filter((item) => item.productId !== productId);
      cart.totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "loi xoa sp gio hang" });
    }
  },
  clearCart: async (req, res) => {
    const { userId } = req.body;
    try {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalQuantity: 0, totalPrice: 0 } },
        { new: true }
      );

      res.status(200).json({ message: "gio hang xoa thanh cong" });
    } catch (error) {
      res.status(500).json({ error: "loi xoa gio hang" });
    }
  },
};
export default cartController;

import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  userId: { type:String, ref: "User", required: true },
  items: [
    {
      productId: { type:String, ref: "Product", required: true },
      quantity: { type: Number, default: 0 },
    },
  ],
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 0, required: true },
        finalPrice: { type: Number, default: 0, required: true },
        priceSale: { type: Number  },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    buyerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      voucher: { type: String },
    },
    status: {
      type: String,
      enum: [
        "Đã đặt hàng",
        "Đang xử lý",
        "Đã vận chuyển",
        "Đã giao hàng",
        "Đã hủy",
      ],
      default: "Đã đặt hàng",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

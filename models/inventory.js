import mongoose from "mongoose";
const { Schema } = mongoose;

const inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock: { type: Number, required: true, default: 0 }, 
    sold: { type: Number, required: true, default: 0 },
    stockHistory: [
      {
        quantity: { type: Number, required: true },
        reason: { type: String, default: "Nhập kho" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);

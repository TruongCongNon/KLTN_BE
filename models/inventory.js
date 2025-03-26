import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type:String,
      ref: "Product",
      required: true,
    },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Inventory  =  mongoose.model("Inventory",inventorySchema)
export default Inventory
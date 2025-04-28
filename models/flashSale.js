import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [ "đang diễn ra", "đã kết thúc"],
      default: "đang diễn ra",
    },
  
  },
  { timestamps: true }
);

export default mongoose.model("FlashSale", flashSaleSchema);

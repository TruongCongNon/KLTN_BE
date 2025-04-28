import mongoose from "mongoose";
import commentSchema from "./comment.js"; 

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    tags: { type: [String], default: [] },
    color: { type: String, required: true },
    images: { type: [String], default: [] },
    category:{ type: String },
    comments: { type: [commentSchema], default: [] }, 
    series: { type: String },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;

import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    rating: { type: Number },
    tags:{type:[String], default:[]}
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

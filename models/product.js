import mongoose from "mongoose";




const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    tags: { type: [String], default: [] },
    color: { type: String, required: true },
    images: { type: [String], default: [] },
    category:{ type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    series: { type: String },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;

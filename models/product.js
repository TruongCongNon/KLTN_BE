import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 }, // so luong con trong kho
    image: { type: String },
    rating: { type: Number },
    tags:{type:[String], default:[]}
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
// {
//     "name":"product1",
//     "price":"100",
//     "description":"abc",
//     "category":"dth",
//     "image":"abvc",
//     "stock":"12",
//     "raiting":"3"
    
// }
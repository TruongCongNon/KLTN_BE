import { query } from "express";
import Product from "../models/product.js";

const productController = {
  createProduct: async (req, res) => {
    try {
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,
        stock: req.body.stock,
        rating: req.body.rating,
        tags: req.body.tags,
      });
      const product = await newProduct.save();
      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
 getAllProduct : async (req, res) => {
    try {
      let query = {};
      if (req.query.category && req.query.category !== "") {
        query.category = req.query.category;
      }
      const products = await Product.find(query);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching products", error });
    }
  },
  getOneByIdProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      return res.status(200).json("Deleted Success");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getRelatedProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId).lean();
      if(!product){
        return res.status(404).json({message: "Product not found"});
      }
      const relateddProduct = await Product.find({
        _id: { $ne: productId },
        $or: [{ category: product.category }, { tags: { $in: product.tags } }],
      }).lean();
      return res.status(200).json(relateddProduct);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
export default productController;

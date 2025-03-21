import { query } from "express";
import Product from "../models/product.js";
import Inventory from "../models/inventory.js";
import mongoose from "mongoose";

const productController = {
  createProduct: async (req, res) => {
    try {
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,
        rating: req.body.rating,
        tags: req.body.tags,
      });
      const product = await newProduct.save();
      await Inventory.create({
        productId: product._id,
        stock: req.body.stock || 0,
        sold: 0,
      });
      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
      const limit = parseInt(req.query.limit) || 10; // Số sản phẩm mỗi trang, mặc định là 10
      const skip = (page - 1) * limit; // Số sản phẩm bỏ qua

      // Lấy tổng số sản phẩm để tính tổng số trang
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      // Lấy sản phẩm theo trang
      const products = await Product.aggregate([
        {
          $lookup: {
            // su dung loookup de lay data tu inventiry
            from: "inventories", // ten collection cua inventory
            localField: "_id",
            foreignField: "productId",
            as: "inventory",
          },
        },
        {
          $unwind: { path: "$inventory", preserveNullAndEmptyArrays: true },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      return res.status(200).json({
        data: products,
        page,
        limit,
        totalProducts,
        totalPages,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching products", error });
    }
  },
  getOneByIdProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(productId) } },
        {
          $lookup: {
            from: "inventories",
            localField: "_id",
            foreignField: "productId",
            as: "inventory",
          },
        },
        { $unwind: { path: "$inventory", preserveNullAndEmptyArrays: true } },
      ]);
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
      const { stock, ...updateProduct } = req.body;
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
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
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

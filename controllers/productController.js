import Inventory from "../models/inventory.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

const productController = {
  createProduct: async (req, res) => {
    try {
      // console.log("req.body return=>", JSON.stringify(req.body, null, 2));
      // console.log(" req.files:", req.files);
      const existingProduct = await Product.findOne({ name: req.body.name });
      console.log("existingProduct:    " + existingProduct);
      if (existingProduct) {
        let inventory = await Inventory.findOne({
          productId: existingProduct._id,
        });
        if (inventory) {
          inventory.stock += parseInt(req.body.stock);
          await inventory.save();
        } else {
          await Inventory.create({
            productId: existingProduct._id.toString(),
            stock: req.body.stock || 0,
            sold: 0,
          });
        }
        return res.status(200).json(existingProduct);
      }
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        color: req.body.color || "red",
        category: req.body.category,
        images: req.file ? `/assets/${req.file.filename}` : null,
        rating: req.body.rating,
        tags: req.body.tags,
      });
      console.log(" Dữ liệu sẽ lưu vào MongoDB:", newProduct);
      const product = await newProduct.save();
      await Inventory.create({
        productId: product._id.toString(),
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      const products = await Product.find().skip(skip).limit(limit);

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
  getAllProductCategory: async (req, res) => {
    try {
      const products = await Product.find();
      return res.status(200).json(products);
    } catch (error) {
      console.log("Lỗi khi lấy sản phẩm:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
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
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json("Deleted Success");
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = { ...req.body };
      if (req.file) {
        updateData.images = `/assets/${req.file.filename}`;
      }
      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      console.log("product nhan duoc =>    " + product);
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

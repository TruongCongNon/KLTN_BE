import Inventory from "../models/inventory.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, description, price, tags, color, series, category } =
        req.body;
      const images = req.files || [];

      const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

      const imagePaths = images.map((file) => `/assets/${file.filename}`);

      const newProduct = new Product({
        name,
        description,
        price,
        tags: parsedTags,
        color,
        series,
        category, // thêm category vào đúng model
        images: imagePaths,
        stock: 0,
        sold: 0,
      });

      await newProduct.save();

      return res.status(201).json({
        message: "Sản phẩm đã được tạo thành công",
        product: newProduct,
      });
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      return res.status(500).json({
        message: "Có lỗi xảy ra khi tạo sản phẩm",
        error: error.message,
      });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      const products = await Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const inventories = await Inventory.find().populate("productId").lean();
      const productWithInventory = products.map((product) => {
        const inv = inventories.find(
          (i) => i.productId?._id?.toString() === product._id.toString()
        );
        return {
          ...product,
          stock: inv ? inv.stock : 0,
          sold: inv ? inv.sold : 0,
        };
      });
      return res.status(200).json({
        data: productWithInventory,
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
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },
  getOneByIdProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).lean();
      const inventory = await Inventory.findOne({
        productId: req.params.id,
      }).lean();
      return res.status(200).json({
        ...product,
        stock: inventory?.stock || 0,
        sold: inventory?.sold || 0,
      });
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
      const { name, description, price, tags, color, series, category } =
        req.body;
      const images = req.files || [];

      const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

      const imagePaths = images.map((file) => `/assets/${file.filename}`);

      const updateData = {
        name,
        description,
        price,
        tags: parsedTags,
        color,
        series,
        category,
      };

      if (images.length > 0) {
        updateData.images = imagePaths;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      return res.status(500).json({ message: error.message });
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
  getProductBycategoryName: async (req, res) => {
    try {
      const name = req.params.name;
      const products = await Product.find({ category: name });

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllProductBySeries: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const series = req.query.series;
      let filter = {};

      if (series) {
        filter.series = series;
      }

      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      const products = await Product.find(filter).skip(skip).limit(limit);

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
};

export default productController;

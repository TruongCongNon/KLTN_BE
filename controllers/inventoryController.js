import mongoose from "mongoose";
import Inventory from "../models/inventory.js";

const inventoryController = {
  // Lấy tồn kho của một sản phẩm
  getInventoryByProductId: async (req, res) => {
    try {
      const productId = req.params.productId;
      console.log("productId=> " + productId);
      // Tìm Inventory dựa theo productId
      const inventory = await Inventory.findOne({ productId });
      console.log("inventory=> " + inventory);
      if (!inventory) {
        return res.status(404).json({ message: "Không tìm thấy tồn kho" });
      }

      return res.status(200).json(inventory);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // Cập nhật tồn kho khi có đơn hàng hoặc nhập hàng
  updateInventory: async (req, res) => {
    try {
      const { stock, sold } = req.body;

      const inventory = await Inventory.findOneAndUpdate(
        { productId: req.params.productId },
        { stock, sold },
        { new: true }
      );

      if (!inventory) {
        return res.status(404).json({ message: "Không tìm thấy tồn kho" });
      }

      return res.status(200).json(inventory);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },
};

export default inventoryController;

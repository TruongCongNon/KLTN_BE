import mongoose from "mongoose";
import Inventory from "../models/inventory.js";
import XLSX from "xlsx";
import Product from "../models/product.js";
import Order from "../models/orders.js";
import PDFDocument from "pdfkit";
const inventoryController = {
  getInventoryByProductId: async (req, res) => {
    try {
      const productId = req.params.productId;

      const inventory = await Inventory.findOne({ productId });

      return res.status(200).json(inventory);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },
  addStock: async (req, res) => {
    try {
      const { stock, reason } = req.body;
      const productId = req.params.productId;
  
      if (stock <= 0) {
        return res.status(400).json({ message: "Số lượng nhập phải > 0" });
      }
  
      let inventory = await Inventory.findOne({ productId });
  
      if (!inventory) {
        inventory = await Inventory.create({
          productId,
          stock: stock, //  dùng stock
          sold: 0,
          stockHistory: [
            {
              quantity: stock,
              reason: reason || "Nhập lần đầu",
            },
          ],
        });
      } else {
        inventory.stock += Number(stock); //  cộng stock
        inventory.stockHistory.push({
          quantity: stock,
          reason: reason || "Nhập kho",
        });
        await inventory.save();
      }
  
      // Update stock vào bảng Product
      await Product.findByIdAndUpdate(
        productId,
        { stock: inventory.stock },
        { new: true }
      );
  
      return res.status(200).json({ message: "Nhập kho thành công", inventory });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },

  sellProduct: async (req, res) => {
    try {
      const { quantity } = req.body;
      const productId = req.params.productId;
      const inventory = await Inventory.findOne({ productId });
  
      if (inventory.stock < quantity) {
        return res.status(400).json({ message: "Số lượng tồn kho không đủ" });
      }
  
      inventory.stock -= Number(quantity); // trừ stock
      inventory.sold += Number(quantity);
      await inventory.save();
  
      const product = await Product.findById(productId);
      if (product) {
        product.stock = inventory.stock; // đồng bộ lại stock
        await product.save();
      }
  
      res.status(200).json({ message: "Cập nhật tồn kho thành công", inventory });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },
  getStockHistory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;  
      const skip = (page - 1) * limit;

      const inventories = await Inventory.find()
        .populate("productId", "name")
        .skip(skip)
        .limit(limit)
        .lean()
        .sort({ createdAt: -1 });
      const totalProducts = await Inventory.countDocuments();

      const totalPages = Math.ceil(totalProducts / limit);

      const stockHistory = inventories.map((inventory) => ({
        // Kiểm tra nếu productId tồn tại và có trường name hợp lệ
        productName:
          inventory.productId && inventory.productId.name
            ? inventory.productId.name
            : "Chưa có tên sản phẩm",
        stockHistory: inventory.stockHistory,
        totalQuantity:
          inventory.stockHistory && inventory.stockHistory.length > 0
            ? inventory.stockHistory.reduce(
                (sum, history) => sum + history.quantity,
                0
              )
            : 0,
      }));
      return res
        .status(200)
        .json({ stockHistory, page, totalPages, totalProducts });
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử nhập kho:", error);
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },
  exportInventory: async (req, res) => {
    try {
      // Lấy dữ liệu từ MongoDB
      const inventories = await Inventory.find()
        .populate("productId", "name")
        .exec();

      // Chuyển dữ liệu từ stockHistory thành mảng đơn giản
      const data = inventories
        .map((inventory) => {
          return inventory.stockHistory.map((history) => ({
            ID: inventory._id,
            ProductName: inventory.productId
              ? inventory.productId.name
              : "Chưa có tên sản phẩm",
            TotalQuantity: history.quantity,
            Reason: history.reason || "Nhập kho",
            Date: new Date(history.date).toLocaleString(),
          }));
        })
        .flat(); // Nối mảng con lại thành mảng chính

      // Chuyển đổi dữ liệu thành sheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Tạo workbook và thêm sheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stock History");

      // Tạo buffer thay vì ghi trực tiếp vào file
      const buffer = await XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      // Gửi file Excel về client dưới dạng buffer
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=stock_history.xlsx"
      );
      res.send(buffer); // Gửi buffer chứa dữ liệu file Excel
    } catch (error) {
      console.error("Lỗi khi xuất dữ liệu:", error);
      res.status(500).json({
        message: "Có lỗi xảy ra khi xuất dữ liệu",
        error: error.message,
      });
    }
  },

};

export default inventoryController;

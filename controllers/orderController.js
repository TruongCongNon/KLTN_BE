import mongoose from "mongoose";
import Order from "../models/orders.js";
import Product from "../models/product.js";
import { handleStockAndFlashSale } from "../services/orderService.service.js";
import PDFDocument from "pdfkit";
import inventory from "../models/inventory.js";
const orderController = {
  createOrder: async (req, res) => {
    try {
      const { user, items, totalPrice, paymentMethod, buyerInfo } = req.body;
      const proccessItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        finalPrice: item.finalPrice,
        priceSale: item.priceSale,
      }));
      const newOrder = new Order({
        user,
        items: proccessItems,
        totalPrice,
        paymentMethod,
        buyerInfo,
      });

      for (const item of items) {
        await handleStockAndFlashSale(item.productId, item.quantity);
      }
      await newOrder.save();
      return res.status(200).json({
        newOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getOrder: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const total = await Order.countDocuments();
      const order = await Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user")
        .populate("items.productId");
      return res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        order,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getOrdersByUserId: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.params.id })
        .populate("user")
        .sort({ createdAt: -1 })
        .populate("items.productId");
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ mesage: error.message });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ mesage: error.message });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Order deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getOrderbyId: async (req, res) => {
    try {
      const id = req.params.id;
      const order = await Order.findById(id)
        .populate("user")
        .populate("items.productId");
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ mesage: "loi server" });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      // 1. Lấy order
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json("Không tìm thấy đơn hàng.");
      if (order.status === "Đã hủy")
        return res.status(400).json("Đơn hàng đã được hủy trước đó.");

      // 2. Hoàn kho
      for (const item of order.items) {
        const productId = item.productId._id?.toString() || item.productId;
        // Inventory
        const inv = await inventory.findOne({ productId });
        if (inv) {
          inv.stock += item.quantity;
          inv.sold = Math.max(inv.sold - item.quantity, 0);
          inv.stockHistory.push({
            quantity: item.quantity,
            reason: "Hủy đơn",
            date: new Date(),
          });
          await inv.save();
        }
        // Product
        const prod = await Product.findById(productId);
        if (prod) {
          prod.stock += item.quantity;
          prod.sold = Math.max(prod.sold - item.quantity, 0);
          await prod.save();
        }
      }

      // 3. Cập nhật trạng thái đơn
      order.status = "Đã hủy";
      await order.save();

      return res.status(200).json("Hủy đơn hàng thành công và đã hoàn kho.");
    } catch (err) {
      console.error("Error in cancelOrder:", err);
      return res.status(500).json("Hủy đơn thất bại. Vui lòng thử lại.");
    }
  },
  updateAddress: async (req, res) => {
    try {
      const { address, name, phone } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json("Không tìm thấy đơn hàng.");
      }

      if (["Đã vận chuyển", "Đã giao hàng", "Đã hủy"].includes(order.status)) {
        return res
          .status(400)
          .json("Không thể thay đổi địa chỉ đơn hàng ở trạng thái hiện tại.");
      }

      console.log("REQ BODY:", req.body); // 👈 kiểm tra thật sự nhận được gì

      if (address) order.buyerInfo.address = address;
      if (name) order.buyerInfo.name = name;
      if (phone) order.buyerInfo.phone = phone;

      await order.save();

      res.status(200).json("Cập nhật địa chỉ thành công.");
    } catch (err) {
      console.error("Lỗi khi cập nhật địa chỉ:", err);
      res.status(500).json("Có lỗi khi cập nhật địa chỉ.");
    }
  },
  exportInvoice: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId)
        .populate("user")
        .populate("items.productId");

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      const doc = new PDFDocument();
      const filename = `Invoice-${orderId}.pdf`;

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      doc.fontSize(20).text("HÓA ĐƠN MUA HÀNG", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Mã đơn hàng: ${order._id}`);
      doc.text(`Khách hàng: ${order.buyerInfo.name}`);
      doc.text(`Số điện thoại: ${order.buyerInfo.phone}`);
      doc.text(`Địa chỉ: ${order.buyerInfo.address}`);
      doc.text(`Phương thức thanh toán: ${order.paymentMethod}`);
      doc.text(`Tổng tiền: $${order.totalPrice}`);
      doc.moveDown();

      doc.text("Danh sách sản phẩm:", { underline: true });
      order.items.forEach((item, idx) => {
        doc.text(
          `${idx + 1}. ${item.productId.name} - SL: ${item.quantity} - Giá: $${
            item.finalPrice
          }`
        );
      });

      doc.end();
    } catch (error) {
      console.error("Lỗi khi xuất hóa đơn:", error);
      return res.status(500).json({ message: "Lỗi khi xuất hóa đơn", error });
    }
  },
};
export default orderController;

import Order from "../models/orders.js";
import { handleStockAndFlashSale } from "../services/orderService.service.js";

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { user, items, totalPrice, paymentMethod, buyerInfo } = req.body;
      const newOrder = new Order({
        user,
        items,
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
  cancelOrrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      console.log("order",order);
      // if (!order) return res.status(404).json("Không tìm thấy đơn hàng.");

      order.status = "Đã hủy";
      await order.save();

      res.status(200).json("Hủy đơn hàng thành công.");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
export default orderController;

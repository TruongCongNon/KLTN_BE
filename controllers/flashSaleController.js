import FlashSale from "../models/flashSale.js";
import Inventory from "../models/inventory.js";
import Product from "../models/product.js";

const flashSaleController = {
  createFlashSale: async (req, res) => {
    try {
      const { productId, startTime, endTime, discountPrice, quantity } =
        req.body;

      console.log(" Dữ liệu nhận:", req.body);

      const conflict = await FlashSale.findOne({
        productId,
        startTime: { $lt: new Date(endTime) },
        endTime: { $gt: new Date(startTime) },
      });

      if (conflict) {
        return res
          .status(400)
          .json("Flash Sale trùng thời gian với sản phẩm khác");
      }

      const flashSale = new FlashSale({
        productId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        discountPrice: Number(discountPrice),
        quantity: Number(quantity),
      });

      await flashSale.save();
      console.log(" Flash Sale đã lưu:", flashSale);

      res.status(200).json(flashSale);
    } catch (error) {
      console.error(" Lỗi lưu Flash Sale:", error.message);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getAllFlashSale: async (req, res) => {
    try {
      const sales = await FlashSale.find().populate("productId");
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getActivedFlashSale: async (req, res) => {
    try {
      const now = new Date();
      const sales = await FlashSale.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        $expr: { $lt: ["$sold", "$quantity"] },
      }).populate("productId");

      // Tính thêm phần trăm đã bán
      const result = sales.map((item) => {
        const percentSold = Math.floor((item.sold / item.quantity) * 100);
        return {
          ...item.toObject(),
          percentSold,
        };
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "lỗi rồi", error: error.message });
    }
  },

  getDiscountFlashSale: async (req, res) => {
    try {
      const { productId } = req.params;
      const now = new Date();
      const flashSale = await FlashSale.findOne({
        startTime: { $lte: now },
        endTime: { $gte: now },
        productId,
      });
      if (!flashSale) return res.status(200).json({ discounted: false });
      res
        .status(200)
        .json({ discounted: true, discountPrice: flashSale.discountPrice });
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  updateFlashSale: async (req, res) => {
    try {
      const update = await FlashSale.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(update);
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  deleteFlashSale: async (req, res) => {
    try {
      await FlashSale.findByIdAndDelete(req.params.id);
      res.status(200).json("xoa thanh cong");
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  removeFlashSaleByProductId: async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await FlashSale.findOneAndDelete({ productId });
      if (!result) return res.status(404).json("kh có sp de xoa");
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  getFlashSaleById: async (req, res) => {
    const { productId } = req.params;
    try {
      const flashSale = await FlashSale.findOne({ productId });
      if (!flashSale) return res.status(200).json(null);
      res.status(200).json(flashSale);
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  buyProductFlashSale: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const now = new Date();

      // 1. Tìm flash sale đang diễn ra
      const flashSale = await FlashSale.findOne({
        productId,
        startTime: { $lte: now },
        endTime: { $gte: now },
      });

      // 2. Tìm tồn kho
      const inventory = await Inventory.findOne({ productId });
      if (!inventory || inventory.stock < quantity) {
        return res.status(400).json({ message: "Không đủ hàng trong kho" });
      }

      // 3. Tìm sản phẩm để lấy giá gốc
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      let flashSold = 0;
      let normalSold = 0;
      let totalPrice = 0;

      // 4. Tính toán flash sale vs giá thường
      if (flashSale && flashSale.sold < flashSale.quantity) {
        const availableFlash = flashSale.quantity - flashSale.sold;
        flashSold = Math.min(quantity, availableFlash);
        normalSold = quantity - flashSold;
        totalPrice =
          flashSold * flashSale.discountPrice + normalSold * product.price;

        // 5. Cập nhật flashSale: tăng sold, trừ quantity
        flashSale.sold += flashSold; // ví dụ 0 + 1 = 1
        flashSale.quantity -= flashSold; // ví dụ 1 - 1 = 0
        await flashSale.save();
      } else {
        // Không còn flash sale hoặc đã bán hết
        normalSold = quantity;
        totalPrice = quantity * product.price;
      }

      // 6. Cập nhật inventory chung
      inventory.stock -= quantity;
      inventory.sold += quantity;
      await inventory.save();

      // 7. Trả về kết quả kèm giá trị mới để front-end cập nhật
      return res.status(200).json({
        message: "Mua hàng thành công",
        totalPrice,
        flashSaleUsed: flashSold,
        normalUsed: normalSold,
        // Dữ liệu mới để UI refresh
        remainingFlashQuantity: flashSale ? flashSale.quantity : 0,
        currentFlashSold: flashSale ? flashSale.sold : 0,
        remainingStock: inventory.stock,
        totalInventorySold: inventory.sold,
      });
    } catch (error) {
      console.error("Lỗi khi mua flash sale:", error);
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  },
};

export default flashSaleController;

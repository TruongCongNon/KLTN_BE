import FlashSale from "../models/flashSale.js";

const flashSaleController = {
  createFlashSale: async (req, res) => {
    try {
      const flashSale = new FlashSale(req.body);
      await flashSale.save();
      res.status(200).json(flashSale);
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  getActivedFlashSale: async (req, res) => {
    try {
      const now = new Date();
      const sale = await FlashSale.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
      }).populate("productId");
      res.status(200).json(sale);
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
  getDiscountFlashSale: async (req, res) => {
    try {
      const { productId } = req.params;
      const now = new Date();
      const flashSale = await FlashSale.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        productId,
      });
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
      if(!flashSale) return res.status(200).json(null)
      res.status(200).json(flashSale);
    } catch (error) {
      res.status(500).json({ message: "loi roi", error: error.message });
    }
  },
};

export default flashSaleController;

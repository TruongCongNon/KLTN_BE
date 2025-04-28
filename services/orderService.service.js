import FlashSale from "../models/flashSale.js";
import Inventory from "../models/inventory.js";
import Product from "../models/product.js";

export const handleStockAndFlashSale = async (productId, quantity) => {
  if (!productId) {
    throw new Error("ProductId không hợp lệ");
  }

  const inventorys = await Inventory.findOne({ productId });
  if (!inventorys) {
    throw new Error("Không tìm thấy Inventory của sản phẩm.");
  }

  inventorys.stock -= quantity;
  inventorys.sold += quantity;
  await inventorys.save();

  const product = await Product.findById(productId);
  if (product) {
    product.stock = inventorys.stock;
    await product.save();
  }

  const flashSale = await FlashSale.findOne({
    productId,
    startTime: { $lte: new Date() },
    endTime: { $gte: new Date() },
  });

  if (flashSale) {
    flashSale.quantity -= quantity;
    if (flashSale.quantity <= 0) {
      flashSale.status = "Đã kết thúc";
    }
    await flashSale.save();
  }
};

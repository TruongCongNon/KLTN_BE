import Category from "../models/categories.js";

const categoryController = {
  createcategory: async (req, res) => {
    try {
      const newCategory = new Category({
        name: req.body.name,
        image: req.body.image
      });
      const category = await newCategory.save();
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getAllcategory: async (req, res) => {
    try {
      const category = await Category.find();
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updatecategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deletecategory: async (req,res) => {
    try {
      const category = await Category.findById(req.params.id);
      return res.status(200).json("Deleted Success");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
export default categoryController;

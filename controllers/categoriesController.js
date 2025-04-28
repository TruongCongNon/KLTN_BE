import Category from "../models/categories.js";

const categoryController = {
  createcategory: async (req, res) => {
    try {
      const newCategory = new Category({
        name: req.body.name,
        images: req.file ? `/assets/${req.file.filename}` : null,
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
  getcategoryById : async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updatecategory: async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = { ...req.body };
      if (req.file) {
        updateData.images = `/assets/${req.file.filename}`;
      }
      const category= await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      console.log("category nhan duoc =>    " + category);
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deletecategory: async (req,res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      return res.status(200).json("Deleted Success");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
export default categoryController;

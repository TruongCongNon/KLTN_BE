

const imagecontroller = {
  uploadImages: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: " No files uploaded!" });
      }

      const fileUrls = req.files.map((file) => ({
        filename: file.filename,
        path: `/assets/${file.filename}`,
      }));

      return res.status(200).json({
        message: "🎉 Upload success!",
        data: fileUrls,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Upload failed!", error: error.message });
    }
  },
};

export default imagecontroller;

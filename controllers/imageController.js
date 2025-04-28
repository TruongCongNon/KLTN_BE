const imageController = {
  uploadImages: async (req, res) => {
    try {
      // Kiểm tra nếu không có file nào được tải lên
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded!" });
      }

      // Lưu lại thông tin về các file đã tải lên
      const fileUrls = req.files.map((file) => ({
        filename: file.filename,
        path: `/assets/${file.filename}`, // Đảm bảo rằng file có thể truy cập thông qua URL này
      }));

      return res.status(200).json({
        message: "Upload success!",
        data: fileUrls, // Trả về thông tin về các file đã tải lên
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      return res
        .status(500)
        .json({ message: "Upload failed!", error: error.message });
    }
  },
};

export default imageController;

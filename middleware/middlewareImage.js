import multer from "multer";
import path from "path";

// Cấu hình multer để lưu file vào thư mục "assets"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/"); // Đảm bảo thư mục này tồn tại trên server
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất với thời gian
  },
});

// Kiểm tra định dạng file, chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg","image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, and .jpeg format allowed!"), false);
  }
};

// Khai báo multer với cấu hình
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file là 5MB
  fileFilter,
});

export default upload;

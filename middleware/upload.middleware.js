const multer = require("multer"); // import multer

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "/"); // Specify the destination directory where uploaded files will be stored
  },
}); // sử dụng bộ nhớ tạm thời để lưu trữ file

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // giới hạn kích thước file upload tối đa là 5MB
  },
}).single("image"); // sử dụng multer để upload file, chỉ cho phép upload 1 file với tên là file

module.exports = upload; // export middleware upload

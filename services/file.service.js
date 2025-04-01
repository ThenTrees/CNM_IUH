const { s3 } = require("../utils/aws-helper"); // import s3 từ models

const randomString = (lengthCharacter) => {
  return `${Math.random()
    .toString(36)
    .substring(2, lengthCharacter + 2)}`;
};

/**
 * upload file to s3 bucket
 */

const uploadFile = async (file) => {
  /**
   * B1: Tạo tên mới cho file -> trách trùng lặp tên trên s3
   * B2: Tạo 1 object params chứa thông tin của file cần upload.
   * B3: Thực hiện upload file bằng method upload.
   * B4: Trả về thông tin của file đã upload.
   * B5: Xử lý lỗi nếu có.
   */
  try {
    const filePath = `${randomString(6)}-${new Date().getTime()}-${
      file?.originalname
    }`; // tạo tên mới cho file

    const uploadParams = {
      // tạo object params chứa thông tin của file cần upload
      Bucket: process.env.BUCKET_NAME, // tên bucket
      Body: file?.buffer,
      Key: filePath,
      ContentType: file?.mimetype, // loại file
    };
    const data = await s3.upload(uploadParams).promise(); // upload file lên s3 bucket
    console.log(`File uploaded successfully. ${data.Location}`); // in ra thông tin của file đã upload
    const fileName = `${process.env.CLOUDFRONT_URL}/${data.Key}`; // Trả về thông tin của file đã upload link file từ CloudFront URL
    return `https://${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error); // xử lý lỗi nếu có
    throw new Error("Error uploading file"); // trả về lỗi
  }
};

module.exports = { uploadFile }; // export hàm uploadFile

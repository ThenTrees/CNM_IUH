const SubjectsModel = require("../models");
const { uploadFile } = require("../services/file.service");

const subjectController = {
  /**
   * get all items from table subject
   * @param {*} req
   * @param {*} res
   * @returns list subjects from table subject on dynamodb
   */
  getSubjects: async (req, res) => {
    /**
     * Bước 1: Thực hiện lấy tất cả các subject từ table Subject bằng method getSubjects của SubjectModel mà ta đã tạo
     * Bước 2: Trả về thông tin của các subject đã lấy
     */
    try {
      const subjects = await SubjectsModel.getSubjects(); // gọi hàm getSubjects từ model
      return res.render("index", { subjects }); // trả về danh sách subjects
    } catch (error) {
      console.error("Error getting subjects:", error); // xử lý lỗi nếu có
      return res.status(500).json({ message: "Error getting subjects" }); // trả về lỗi
    }
  },

  /**
   * get subject by id
   * @param {*} req
   * @param {*} res
   * @return subject by id from table subject on dynamodb
   */
  getSubjectById: async (req, res) => {
    /**
     * Bước 1: Lấy id từ params của request
     * Bước 2: Thực hiện lấy subject từ table Subject bằng method getSubjectById của SubjectModel mà ta đã tạo
     * Bước 3: Trả về thông tin của subject đã lấy
     * Bước 4: Nếu không tìm thấy subject thì trả về lỗi 404
     */
    try {
      const { id } = req.params; // lấy id từ params của request
      const subject = await SubjectsModel.getSubjectById(id); // gọi hàm getSubjectById từ model
      console.log(subject);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" }); // nếu không tìm thấy subject thì trả về lỗi 404
      }

      return res.render("subject", { subject }); // trả về thông tin của subject đã lấy
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting subject");
    }
  },

  /**
   * add subject to table subject
   * @param {*} req
   * @param {*} res
   */
  addSubject: async (req, res) => {
    /**
     * Bước 1: Lấy thông tin subject từ body của request
     * Bước 2: Thực hiện thêm subject vào table Subject bằng method addSubject của SubjectModel mà ta đã tạo
     * Bước 3: Trả về thông tin của subject đã thêm
     */
    try {
      const { name, type } = req.body; // lấy thông tin subject từ body của request

      const image = req.file;
      const imgUrl = await uploadFile(image); // upload file lên s3 bucket
      const subjectData = { name, type, imgUrl };
      await SubjectsModel.createSubjects(subjectData); // gọi hàm addSubject từ model
      res.redirect("/subjects"); // trả về thông tin của subject đã thêm
    } catch (error) {
      console.error("Error adding subject:", error); // xử lý lỗi nếu có
      return res.status(500).json({ message: "Error adding subject" }); // trả về lỗi
    }
  },

  /**
   * delete subject by id
   * @param {*} req
   * @param {*} res
   */
  deleteSubject: async (req, res) => {
    /**
     * Bước 1: Lấy id từ params của request
     * Bước 2: Thực hiện xoá subject từ table Subject bằng method deleteSubject của SubjectModel mà ta đã tạo
     * Bước 3: Trả về thông tin của subject đã xoá
     */
    try {
      const { id } = req.params; // lấy id từ params của request
      const existSubject = await SubjectsModel.getSubjectById(id);
      const subject = await SubjectsModel.deleteSubject(id, existSubject.name); // gọi hàm deleteSubject từ model
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" }); // nếu không tìm thấy subject thì trả về lỗi 404
      }
      res.redirect("/subjects"); // trả về thông tin của subject đã xoá
    } catch (error) {
      console.error("Error deleting subject:", error); // xử lý lỗi nếu có
      return res.status(500).json({ message: "Error deleting subject" }); // trả về lỗi
    }
  },

  /**
   * update subject by id
   * @param {*} req
   * @param {*} res
   */
  updateSubject: async (req, res) => {
    console.log("update subject::", req.body);
    const id = req.params.id; // lấy id từ params của request
    const { name, type } = req.body; // lấy thông tin subject từ body của request
    const image = req?.file;
    let imgUrl;
    if (!image) {
      imgUrl = req.body.image; // upload file lên s3 bucket
    } else {
      imgUrl = await uploadFile(image); // upload file lên s3 bucket
    }
    const subjectData = { name, type, imgUrl };
    const subject = await SubjectsModel.updateSubject(id, subjectData); // gọi hàm updateSubject từ model
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" }); // nếu không tìm thấy subject thì trả về lỗi 404
    }
    res.redirect("/subjects"); // trả về thông tin của subject đã cập nhật
  },
};

module.exports = subjectController;

const { dynamodb } = require("../utils/aws-helper");
const { v4: uuidv4 } = require("uuid"); // import uuid de tao id cho subject

const tableName = "Subjects";

const SubjectsModel = {
  createSubjects: async (subjectData) => {
    /**
     * Bước 1: Tạo một unique ID cho subject
     * Bước 2: Tạo một object params chứa thông tin của subject
     * Bước 3: Thực hiện thêm subject vào table Subject
     * Bước 4: Trả về thông tin của subject đã tạo
     * Bước 5: Xử lý lỗi nếu có
     */

    const subjectId = uuidv4(); // tạo id cho subject
    const params = {
      TableName: tableName,
      Item: {
        id: subjectId,
        name: subjectData.name,
        type: subjectData.type,
        image: subjectData.imgUrl, // lấy thông tin của subject từ body của request
      },
    };
    try {
      await dynamodb.put(params).promise(); // thêm subject vào table Subject
      return params.Item; // trả về thông tin của subject đã tạo
    } catch (error) {
      console.error("Error creating subject:", error); // xử lý lỗi nếu có
      throw new Error("Error creating subject"); // trả về lỗi
    }
  },

  getSubjects: async () => {
    /**
     * Bước 1: Tạo một object params chứa thông tin của table Subject
     * Bước 2: Thực hiện lấy tất cả các subject từ table Subject bằng method scan
     * Bước 3: Trả về thông tin của các subject đã lấy
     */
    const params = {
      TableName: tableName,
    };
    try {
      const subjects = await dynamodb.scan(params).promise(); // lấy tất cả các subject từ table Subject
      return subjects.Items; // trả về thông tin của các subject đã lấy
    } catch (error) {
      console.error("Error getting subjects:", error); // xử lý lỗi nếu có
      throw new Error("Error getting subjects"); // trả về lỗi
    }
  },

  // xoá subject
  deleteSubject: async (subjectId, name) => {
    /**
     * B1: Tạo 1 object params chứa thông tin của subject cần xoá.
     * B2: Thực hiện xoá subject bằng method delete.
     * B3: Trả về thông tin của subject đã xoá.
     * B4: Xử lý lỗi nếu có.
     */
    const params = {
      TableName: tableName,
      Key: {
        id: subjectId,
      },
    };
    try {
      await dynamodb.delete(params).promise(); // xoá subject
      return params.Key; // trả về thông tin của subject đã xoá
    } catch (error) {
      console.error("Error deleting subject:", error); // xử lý lỗi nếu có
      throw new Error("Error deleting subject"); // trả về lỗi
    }
  },

  getSubjectById: async (subjectId) => {
    /**
     * B1: Tạo 1 object params chứa thông tin của subject cần lấy.
     * B2: Thực hiện lấy subject bằng method get.
     * B3: Trả về thông tin của subject đã lấy.
     * B4: Xử lý lỗi nếu có.
     */
    const params = {
      TableName: tableName,
      KeyConditionExpression: "id = :id", // điều kiện lấy subject theo subject id
      // gia tri cua dieu kien tren
      ExpressionAttributeValues: {
        ":id": subjectId, // giá trị của id là subjectId
      },
    };
    try {
      const result = await dynamodb.query(params).promise(); // lấy subject
      return result.Items[0]; // trả về thông tin của subject đã lấy
    } catch (error) {
      console.error("Error getting subject:", error); // xử lý lỗi nếu có
      throw new Error("Error getting subject"); // trả về lỗi
    }
  },

  updateSubject: async (subjectId, subjectData) => {
    console.log("update subject::", subjectData.imgUrl);
    const params = {
      TableName: tableName,
      Key: {
        id: subjectId,
      },
      UpdateExpression: "set #n = :name, #t = :type, #i = :image",
      ExpressionAttributeNames: {
        "#n": "name",
        "#t": "type",
        "#i": "image",
      },
      ExpressionAttributeValues: {
        ":name": subjectData.name,
        ":type": subjectData.type,
        ":image": subjectData.imgUrl, // lấy thông tin của subject từ body của request
      },
      ReturnValues: "ALL_NEW", // Trả về thông tin của subject sau khi cập nhật,  có các option khác như NONE, UPDATED_OLD, ALL_OLD
    };
    try {
      const updateSubject = await dynamodb.update(params).promise(); // cập nhật subject
      return updateSubject.Attributes; // trả về thông tin của subject đã cập nhật
    } catch (error) {
      console.error("Error updating subject:", error); // xử lý lỗi nếu có
      throw new Error("Error updating subject"); // trả về lỗi
    }
  },
};

module.exports = SubjectsModel;

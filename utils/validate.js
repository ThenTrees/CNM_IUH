const nameRegex = /^[a-zA-Z0-9\s]+$/;
const typeRegex = /^[a-zA-Z0-9\s]+$/;
const checkEmpty = (payload) => {
  // Kiểm tra xem payload có thuốc tính nào bị rỗng không
  const { name, type, semester, faculty } = payload;
  if (!name || !type) {
    return true;
  }
  return false;
};

module.exports = {
  validatePayload: (payload) => {
    const { name, type } = payload;
    const errors = [];

    if (checkEmpty(payload)) {
      errors.push("All fields are required");
    }

    if (!nameRegex.test(name)) {
      errors.push("Name must be a string");
    }

    if (!typeRegex.test(type)) {
      errors.push("Type must be a string");
    }

    if (errors?.length > 0) {
      return errors;
    }

    return null;
  },
};

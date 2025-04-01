const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware"); // import middleware upload
const subjectController = require("../controllers/index.controller");

router.get("/", subjectController.getSubjects); // get all subjects
router.post("/", upload, subjectController.addSubject); // add subjects
router.get("/:id", subjectController.getSubjectById); // get subject by id
router.post("/update/:id", upload, subjectController.updateSubject); // get subject by id
router.post("/delete/:id", subjectController.deleteSubject); // delete subject by id
module.exports = router; // export router

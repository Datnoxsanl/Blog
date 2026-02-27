const express = require("express");
const router = express.Router();

const coursesController = require("../app/controllers/CoursesController");

router.get("/create", coursesController.create);
router.post("/store", coursesController.store);
router.put("/:id", coursesController.update);
router.delete("/:id", coursesController.delete);
router.delete("/:id/force", coursesController.forceDelete);
router.patch("/:id/restore", coursesController.restore);
router.get("/:id/edit", coursesController.edit);
router.get("/:slug", coursesController.show);

module.exports = router;

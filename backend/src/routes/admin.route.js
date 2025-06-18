import express from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getAllInstructors,
  updateCourse,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/courses", getAllCourses);
router.post("/courses", addCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/instructors", getAllInstructors);

export default router;

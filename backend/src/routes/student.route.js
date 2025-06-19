import express from "express";
import { addCourse, deleteCourse, getAllCourses, getCourse, getMyCourses } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/public-courses", getAllCourses);
router.get("/courses", getMyCourses);
router.get("/course/:id", getCourse);
router.post("/courses/:id", addCourse);
router.delete("/courses/:id", deleteCourse);

export default router;

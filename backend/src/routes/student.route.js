import express from "express";
import { addCourse, getAllCourses, getCourse, getMyCourses } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/my-courses", getMyCourses);
router.get("/course/:id", getCourse);
router.post("/courses/:id", addCourse);

export default router;

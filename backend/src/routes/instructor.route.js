import express from "express";
import {
  addSchedule,
  deleteSchedule,
  getAllCourses,
  getCourse,
  updateSchedule,
} from "../controllers/instructor.controller.js";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/course/:id", getCourse);
router.post("/schedule/:id", addSchedule);
router.delete("/schedule/:courseId/:scheduleId", deleteSchedule);
router.put("/schedule/:id", updateSchedule);

export default router;

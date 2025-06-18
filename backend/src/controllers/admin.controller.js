import { generateUniqueCode } from "../libs/generateCode.js";
import logger from "../libs/logger.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const getAllCourses = async (_, res, next) => {
  try {
    const courses = await Course.find({}).populate({ path: "instructor", select: "-password" }).lean();
    res.status(200).json(courses);
  } catch (error) {
    logger.error(`Error in getAllCourses controller: ${error.message}`);
    next(error);
  }
};

export const addCourse = async (req, res, next) => {
  try {
    const { subject, course, instructor } = req.body;
    if (!subject || !course || !instructor) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const isInstructor = await User.findOne({ _id: instructor, role: { $eq: "instructor" } }).lean();
    if (!isInstructor) {
      return res.status(400).json({ error: "This user is not an instructor" });
    }

    const newCourse = await Course.create({
      subject,
      course,
      instructor,
      code: generateUniqueCode(),
    });

    res.status(201).json(newCourse);
  } catch (error) {
    logger.error(`Error in addCourse controller: ${error.message}`);
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { subject, course, instructor } = req.body;
    const { id } = req.params;

    let existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(400).json({ error: "Course not found" });
    }

    Promise.all([
      (existingCourse.subject = subject || existingCourse.subject),
      (existingCourse.course = course || existingCourse.course),
      (existingCourse.instructor = instructor || existingCourse.instructor),
    ]);

    await existingCourse.save();
    res.status(200).json(existingCourse);
  } catch (error) {
    logger.error(`Error in updateCourse controller: ${error.message}`);
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    logger.error(`Error in deleteCourse controller: ${error.message}`);
    next(error);
  }
};

export const getAllInstructors = async (_, res, next) => {
  try {
    const instructors = await User.find({
      role: {
        $eq: "instructor",
      },
    })
      .select("-password")
      .lean();

    res.status(200).json(instructors);
  } catch (error) {
    logger.error(`Error in getAllInstructors controller: ${error.message}`);
    next(error);
  }
};

import logger from "../libs/logger.js";
import Course from "../models/course.model.js";

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      students: {
        $nin: [req.user._id],
      },
    })
      .populate("instructor")
      .select("-code")
      .lean()
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    logger.error(`Error in getAllCourses controller: ${error.message}`);
    next(error);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      students: {
        $in: [req.user._id],
      },
    })
      .select("-code")
      .lean();

    res.status(200).json(courses);
  } catch (error) {
    logger.error(`Error in getMyCourses controller: ${error.message}`);
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id).populate("schedules").select("-code").lean();
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    logger.error(`Error in getCourse controller: ${error.message}`);
    next(error);
  }
};

export const addCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const code = req.body.code;

    let isValidCode = await Course.findOne({ _id: id, code }).lean();
    if (!isValidCode) {
      return res.status(400).json({ error: "Invalid code. Please try again" });
    }

    let existingCourse = await Course.findOne({
      _id: id,
      students: {
        $in: req.user._id,
      },
    });
    if (existingCourse) {
      return res.status(400).json({ error: "Course already exist" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        $push: { students: req.user._id },
      },
      { new: true }
    )
      .select("-code")
      .populate("students");

    res.status(200).json(updatedCourse);
  } catch (error) {
    logger.error(`Error in addCourse controller: ${error.message}`);
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        students: req.user._id,
      },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    logger.error(`Error in deleteCourse controller: ${error.message}`);
    next(error);
  }
};

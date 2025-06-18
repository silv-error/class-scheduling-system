import logger from "../libs/logger.js";
import Course from "../models/course.model.js";
import Schedule from "../models/schedule.model.js";

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate("schedules").lean();
    res.status(200).json(courses);
  } catch (error) {
    logger.error(`Error in getAllCourses controller: ${error.message}`);
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("schedules").lean();
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    logger.error(`Error in getCourse controller: ${error.message}`);
    next(error);
  }
};

export const addSchedule = async (req, res, next) => {
  try {
    const { startTime, endTime, room, type } = req.body;
    const { id } = req.params;

    const newSchedule = await Schedule.create({ startTime, endTime, room, type });
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        $push: {
          schedules: newSchedule._id,
        },
      },
      { new: true }
    ).populate("schedules");

    res.status(201).json(updatedCourse);
  } catch (error) {
    logger.error(`Error in addSchedule controller: ${error.message}`);
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { courseId, scheduleId } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          schedules: scheduleId,
        },
      },
      { new: true }
    );
    await Schedule.findByIdAndDelete(updatedCourse);
    res.status(200).json({ error: "Schedule deleted successfully" });
  } catch (error) {
    logger.error(`Error in deleteSchedule controller: ${error.message}`);
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { startTime, endTime, room } = req.body;
    const { id } = req.params;

    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    Promise.all([
      (schedule.startTime = startTime || schedule.startTime),
      (schedule.endTime = endTime || schedule.endTime),
      (schedule.room = room || schedule.room),
    ]);

    await schedule.save();
    res.status(200).json(schedule);
  } catch (error) {
    logger.error(`Error in updateSchedule controller: ${error.message}`);
    next(error);
  }
};

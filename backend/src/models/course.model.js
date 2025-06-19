import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    schedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;

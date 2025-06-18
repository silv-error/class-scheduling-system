import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["original", "makeup"],
      required: true,
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;

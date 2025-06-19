import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";
import axiosInstance from "../lib/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const CreateCourseModal = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
  const queryClient = useQueryClient();

  const { data: instructors } = useQuery({
    queryKey: ["existingInstructors"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/admin/instructors");
        console.log("instructors", res.data);
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
  });

  const [courseData, setCourseData] = useState({
    subject: "",
    course: "",
    instructor: "",
    description: "",
    startTime: "",
    endTime: "",
    day: "",
  });

  const { mutate: createCourse, isPending } = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async (courseData) => {
      try {
        const res = await axiosInstance.post("/admin/courses/", courseData);
        return res.data;
      } catch (error) {
        toast.error(error.response.data.error);
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: () => {
      toast.success("Course added successfully");
      queryClient.invalidateQueries({ queryKey: ["publicCourses"] });
      setIsCreateModalOpen(false);
      setCourseData({
        subject: "",
        course: "",
        instructor: "",
        description: "",
        startTime: "",
        endTime: "",
        day: "",
      });
    },
  });

  const handleOnCreate = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(courseData);
    createCourse(courseData);
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              type="text"
              name="subject"
              placeholder="Subject"
              value={courseData.subject}
              onChange={handleOnCreate}
              required
            />
            <Input
              type="text"
              name="course"
              placeholder="Course & Year"
              value={courseData.course}
              onChange={handleOnCreate}
              required
            />
            <Select
              name="instructor"
              value={courseData.instructor}
              onValueChange={(value) => setCourseData({ ...courseData, instructor: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors?.map((instructor) => (
                  <SelectItem key={instructor?._id} value={instructor?._id}>
                    {instructor?.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              name="description"
              placeholder="Description"
              value={courseData.description}
              onChange={handleOnCreate}
              required
            />
            <Input type="time" name="startTime" value={courseData.startTime} onChange={handleOnCreate} required />
            <Input type="time" name="endTime" value={courseData.endTime} onChange={handleOnCreate} required />
            <Select
              name="day"
              value={courseData.day}
              onValueChange={(value) => setCourseData({ ...courseData, day: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner /> Loading...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { Textarea } from "../components/ui/textarea";

const EditCourseModal = ({ editCourseModal, setEditCourseModal }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["editCourse"],
    mutationFn: async () => {
      try {
        console.log("are we running");
        const res = await axiosInstance.put(`/admin/courses/${editCourseModal._id}`, editCourseModal);
        if (res.status !== 200) throw new Error(error);

        toast.success("Course has been updated");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicCourses"] });
      setEditCourseModal(null);
    },
  });

  return (
    <Dialog open={editCourseModal} onOpenChange={setEditCourseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        {editCourseModal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
          >
            <div className="grid gap-4 py-4">
              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                value={editCourseModal.subject}
                onChange={(e) => setEditCourseModal({ ...editCourseModal, subject: e.target.value })}
                required
              />
              <Input
                type="text"
                name="course"
                placeholder="Course Code"
                value={editCourseModal.course}
                onChange={(e) => setEditCourseModal({ ...editCourseModal, course: e.target.value })}
                required
              />
              <Textarea
                type="text"
                name="description"
                placeholder="Description"
                value={editCourseModal.description}
                onChange={(e) => setEditCourseModal({ ...editCourseModal, description: e.target.value })}
                required
              />
              <Input
                type="time"
                name="startTime"
                value={editCourseModal.startTime} // Extract HH:mm from ISO string
                onChange={(e) => setEditCourseModal({ ...editCourseModal, startTime: e.target.value })}
                required
              />
              <Input
                type="time"
                name="endTime"
                value={editCourseModal.endTime} // Extract HH:mm from ISO string
                onChange={(e) => setEditCourseModal({ ...editCourseModal, endTime: e.target.value })}
                required
              />
              <Select
                name="day"
                value={editCourseModal.day}
                onValueChange={(value) => setEditCourseModal({ ...editCourseModal, day: value })}
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
                {isPending ? <LoadingSpinner /> : "Update Course"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;

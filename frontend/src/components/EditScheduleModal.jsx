import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LoadingSpinner from "./common/LoadingSpinner";

const EditScheduleModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedSchedule,
  setSelectedSchedule,
  daysOfWeek,
  handleEditSubmit,
  isEditing,
}) => {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        {selectedSchedule && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right">
                Day
              </Label>
              <select
                name="day"
                value={selectedSchedule.day}
                onChange={(e) => {
                  const newDay = e.target.value;
                  setSelectedSchedule((prev) => ({
                    ...prev,
                    day: newDay,
                  }));
                }}
                className="col-span-3 border rounded px-3 py-2"
                required
              >
                <option value="">Select a day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                type="date"
                name="date"
                value={new Date(selectedSchedule.date).toISOString().slice(0, 10)} // Format for date input
                onChange={(e) => {
                  const newDate = e.target.value;
                  setSelectedSchedule((prev) => ({
                    ...prev,
                    date: newDate,
                  }));
                }}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                type="time"
                name="startTime"
                value={selectedSchedule.startTime} // Use string directly
                onChange={(e) => {
                  const newTime = e.target.value;
                  setSelectedSchedule((prev) => ({
                    ...prev,
                    startTime: newTime, // Store as string
                  }));
                }}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                type="time"
                name="endTime"
                value={selectedSchedule.endTime} // Use string directly
                onChange={(e) => {
                  const newTime = e.target.value;
                  setSelectedSchedule((prev) => ({
                    ...prev,
                    endTime: newTime, // Store as string
                  }));
                }}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Input
                name="room"
                value={selectedSchedule.room}
                onChange={(e) =>
                  setSelectedSchedule({
                    ...selectedSchedule,
                    room: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing ? (
                  <>
                    <LoadingSpinner /> Saving Changes...
                  </>
                ) : (
                  "Update Schedule"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduleModal;

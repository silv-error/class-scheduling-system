import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LoadingSpinner from "./common/LoadingSpinner";

const CreateScheduleModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  handleCreateSubmit,
  handleOnCreate,
  daysOfWeek,
  newSchedule,
  addingPending,
}) => {
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="day" className="text-right">
              Day
            </Label>
            <select
              name="day"
              value={newSchedule.day}
              onChange={handleOnCreate}
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
              value={newSchedule.date} // Use string directly
              onChange={handleOnCreate}
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
              value={newSchedule.startTime} // Use string directly
              onChange={handleOnCreate}
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
              value={newSchedule.endTime} // Use string directly
              onChange={handleOnCreate}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              Room
            </Label>
            <Input
              type="text"
              name="room"
              value={newSchedule.room} // Use string directly
              onChange={handleOnCreate}
              className="col-span-3"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addingPending}>
              {addingPending ? <LoadingSpinner /> : "Create Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleModal;

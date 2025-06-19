import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { Eye, EyeOff, MoreHorizontal, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EditScheduleModal from "../components/EditScheduleModal";
import CreateScheduleModal from "../components/CreateScheduleModal";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ScheduleTable() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    startTime: "",
    endTime: "",
    room: "",
    day: "",
    date: "",
    type: "original",
  });

  const queryClient = useQueryClient();

  const { data: schedulesData, refetch } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/instructor/course/${id}`);
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
  });

  React.useEffect(() => {
    refetch();
  }, [id]);

  const { mutate: addSchedule, isPending: addingPending } = useMutation({
    mutationKey: ["addSchedule"],
    mutationFn: async () => {
      try {
        const res = await axios.post(`/instructor/schedule/${id}`, newSchedule);
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: () => {
      toast.success("Schedule created successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsCreateModalOpen(false);
      setNewSchedule({
        startTime: "",
        endTime: "",
        room: "",
        day: "",
        date: "",
        type: "original",
      });
    },
  });

  const { mutate: editSchedule, isPending: isEditing } = useMutation({
    mutationKey: ["editSchedule"],
    mutationFn: async () => {
      try {
        const response = await axios.put(`/instructor/schedule/${selectedSchedule._id}`, selectedSchedule);
        if (response.status !== 200) {
          throw new Error(error);
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    },
    onSuccess: () => {
      toast.success("Schedule updated successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsEditModalOpen(false);
    },
  });

  const { mutate: deleteSchedule, isPending: deleteScheduleIsPending } = useMutation({
    mutationKey: ["deleteSchedule"],
    mutationFn: async ({ scheduleId }) => {
      try {
        const response = await axios.delete(`/instructor/schedule/${id}/${scheduleId}`);
        if (response.status !== 200) {
          toast.error(response.data.error);
          throw new Error(error);
        }
        toast.success("Schedule deleted successfully");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    editSchedule();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    addSchedule();
  };

  const handleOnCreate = async (e) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const [showValue, setShowValue] = useState(false);

  React.useEffect(() => {
    return () => {
      setShowValue(false);
    };
  }, [id]);

  return (
    <div className="w-full">
      <h1 className="text-center font-medium text-md tracking-wide">
        {schedulesData?.subject} - {schedulesData?.course}
      </h1>
      <p className="text-center font-medium text-gray-600">
        {schedulesData?.startTime} - {schedulesData?.endTime}{" "}
      </p>
      <div className="relative max-w-40 my-2 mx-auto">
        <Input type={showValue ? "text" : "password"} value={schedulesData?.code} readOnly className="pr-10" />
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => setShowValue(!showValue)}
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        >
          {showValue ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <Button variant={"outline"} onClick={() => setIsCreateModalOpen(true)}>
        <Plus /> Create Schedule
      </Button>

      <div className="rounded-md border mt-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Day</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedulesData?.schedules?.map((schedule) => (
              <tr key={schedule._id} className="text-center">
                <td className="capitalize">{schedule.day}</td>
                <td>{new Date(schedule.date).toLocaleDateString()}</td>
                <td>{schedule.startTime}</td>
                <td>{schedule.endTime}</td>
                <td className="capitalize">{schedule.room}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit schedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteSchedule({ scheduleId: schedule?._id })}
                        className="text-red-500"
                      >
                        {deleteScheduleIsPending ? <LoadingSpinner /> : "Delete Schedule"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {schedulesData?.schedules?.length === 0 && (
              <tr className="text-center">
                <td colSpan={6} className="p-4">
                  No schedules available at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Schedule Modal */}
      <EditScheduleModal
        selectedSchedule={selectedSchedule}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setSelectedSchedule={setSelectedSchedule}
        daysOfWeek={daysOfWeek}
        handleEditSubmit={handleEditSubmit}
        isEditing={isEditing}
      />

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        handleCreateSubmit={handleCreateSubmit}
        handleOnCreate={handleOnCreate}
        daysOfWeek={daysOfWeek}
        newSchedule={newSchedule}
        addingPending={addingPending}
      />
    </div>
  );
}

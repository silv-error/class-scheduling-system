import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";
import axiosInstance from "../lib/axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { Label } from "../components/ui/label";
import LoadingSpinner from "../components/common/LoadingSpinner";

const EnrollModal = ({ enrollModal, setEnrollModal }) => {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["enroll"],
    mutationFn: async () => {
      try {
        const res = await axiosInstance.post(`/student/courses/${enrollModal?._id}`, { code });
        if (res.status !== 200) throw new Error(error);
      } catch (error) {
        toast.error(error.response.data.error, { id: "enroll" });
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Course has been added", { id: "enroll" });
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myCourses"] }),
        queryClient.invalidateQueries({ queryKey: ["publicCourses"] }),
      ]);
    },
  });

  return (
    <Dialog open={enrollModal} onOpenChange={setEnrollModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter the code for {enrollModal?.subject} Course</DialogTitle>
          <DialogDescription>{enrollModal?.description} </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await mutateAsync();
            setEnrollModal(null);
          }}
        >
          <div className="grid gap-4 py-4">
            <Label>Subject Code</Label>
            <Input
              type="text"
              name="subject"
              placeholder="ex: ABCD2134"
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner /> Saving course...
                </>
              ) : (
                "Add this course!"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollModal;

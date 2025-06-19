import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, Edit, MoreHorizontal, Trash, User } from "lucide-react";
import axios from "../lib/axios";
import { format, formatDistanceToNow } from "date-fns";
import CreateCourseModal from "./CreateCourseModal";
import EnrollModal from "./EnrollModal";
import EditCourseModal from "./EditCourseModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Input } from "../components/ui/input";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [enrollModal, setEnrollModal] = useState(null);
  const [editCourseModal, setEditCourseModal] = useState(null);
  const [filter, setFilter] = useState(""); // State for filter input

  const queryClient = useQueryClient();
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicCourses"],
    queryFn: async () => {
      try {
        const res = await axios.get("/student/public-courses");
        return res.data;
      } catch (error) {
        console.error(error.response.data.error);
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteCourse, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteCourse"],
    mutationFn: async ({ courseId }) => {
      try {
        const res = await axiosInstance.delete(`/admin/courses/${courseId}`);
        if (res.status !== 200) throw new Error(res.data.error || "Something went wrong");
        toast.success("Schedule deleted successfully");
      } catch (error) {
        toast.error(error.response.data.error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicCourses"] });
    },
  });

  console.log("courses", courses);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 p-6">Error loading courses</div>;
  }

  // Filter courses based on the input
  const filteredCourses = courses?.filter(
    (course) =>
      course.subject.toLowerCase().includes(filter.toLowerCase()) ||
      course.course.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to EduPlanner</h1>

      {authUser?.role === "admin" && (
        <Button onClick={() => setIsCreateModalOpen(true)} className="mb-4">
          Create Course
        </Button>
      )}

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter by subject or course name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses?.map((course) => (
          <Card key={course._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{course?.subject}</CardTitle>
                  <CardDescription className="mt-1">{course?.course.toUpperCase()}</CardDescription>
                </div>
                {authUser?.role === "admin" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditCourseModal(course)}>
                        <Edit className="mr-2" /> Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteCourse({ courseId: course._id })}
                        className="text-red-500"
                        disabled={isDeleting}
                      >
                        <Trash className="mr-2" /> {isDeleting ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{course?.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{course?.instructor?.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDistanceToNow(course?.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {course?.startTime} - {course?.endTime}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              {authUser?.role === "student" && <Button onClick={() => setEnrollModal(course)}>Enroll</Button>}
            </CardFooter>
          </Card>
        ))}
        {filteredCourses?.length === 0 && (
          <p className="col-span-full text-center opacity-90 font-medium">No courses available at the moment.</p>
        )}
      </div>
      {/* Create Course Modal */}
      {authUser?.role === "admin" && (
        <>
          <CreateCourseModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
          <EditCourseModal editCourseModal={editCourseModal} setEditCourseModal={setEditCourseModal} />
        </>
      )}

      {authUser?.role === "student" && <EnrollModal enrollModal={enrollModal} setEnrollModal={setEnrollModal} />}
    </div>
  );
};

export default HomePage;

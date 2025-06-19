import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Adjust the import path as necessary
import { Textarea } from "@/components/ui/textarea"; // Adjust the import path as necessary
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjust the import path as necessary
import CreateCourseModal from "./CreateCourseModal";

// Mock data - replace with your actual data fetching
const mockCourses = [
  {
    id: "1",
    title: "Advanced React",
    code: "CS-401",
    description: "Learn advanced React patterns and performance optimization",
    instructor: "Dr. Smith",
    schedule: {
      day: "Monday & Wednesday",
      time: "10:00 AM - 11:30 AM",
    },
    studentsEnrolled: 24,
    maxStudents: 30,
  },
  {
    id: "2",
    title: "Database Systems",
    code: "CS-402",
    description: "Fundamentals of database design and SQL",
    instructor: "Prof. Johnson",
    schedule: {
      day: "Tuesday & Thursday",
      time: "1:00 PM - 2:30 PM",
    },
    studentsEnrolled: 18,
    maxStudents: 25,
  },
  {
    id: "3",
    title: "Cloud Computing",
    code: "CS-403",
    description: "Introduction to cloud services and architecture",
    instructor: "Dr. Williams",
    schedule: {
      day: "Friday",
      time: "9:00 AM - 12:00 PM",
    },
    studentsEnrolled: 15,
    maxStudents: 20,
  },
];

const HomePage = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    subject: "",
    course: "",
    instructor: "",
    description: "",
    startTime: "",
    endTime: "",
    day: "",
  });

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      // In a real app, you would fetch from your API here
      // const response = await fetch('/api/courses');
      // return response.json();
      return mockCourses; // Using mock data for this example
    },
  });

  const createCourse = useMutation({
    mutationFn: async (newCourse) => {
      // Replace with your API call
      console.log("Creating course:", newCourse);
      // const response = await axios.post('/api/courses', newCourse);
      // return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
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
    // Convert startTime and endTime to Date format
    const startDateTime = new Date(courseData.date + "T" + courseData.startTime);
    const endDateTime = new Date(courseData.date + "T" + courseData.endTime);

    const newCourse = {
      ...courseData,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };

    createCourse.mutate(newCourse);
  };

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Class Scheduling System</h1>
      <Button onClick={() => setIsCreateModalOpen(true)} className="mb-4">
        Create Course
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="mt-1">{course.code}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {course.studentsEnrolled}/{course.maxStudents}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{course.schedule.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.schedule.time}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button>Enroll</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Create Course Modal */}
      {authUser.role === "admin" && <CreateCourseModal />}
    </div>
  );
};

export default HomePage;

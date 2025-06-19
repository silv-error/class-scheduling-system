import { Plus, MoreHorizontal } from "lucide-react"; // Importing the Plus and MoreHorizontal icons
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import ModeToggle from "./ModeToggle"; // Ensure you import ModeToggle
import LogoutButton from "./LogoutButton"; // Ensure you import LogoutButton
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"; // Import dropdown components
import toast from "react-hot-toast"; // For notifications

export function AppSidebar() {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: courses, isFetching } = useQuery({
    queryKey: ["myCourses"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/${authUser?.role}/courses`);
        if (res.status !== 200) throw new Error(res.data.error || "Something went wrong");

        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
  });

  const { mutate: deleteCourse } = useMutation({
    mutationKey: ["deleteCourse"],
    mutationFn: async (courseId) => {
      try {
        const res = await axiosInstance.delete(`/student/courses/${courseId}`);
        if (res.status !== 200) throw new Error(res.data.error || "Something went wrong");
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error(error.response.data.error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCourses"] });
    },
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"text-lg mb-4 font-bold"}>
            <Link to={"/"}>EduPlanner</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {authUser?.role !== "admin" && (
              <SidebarMenu>
                {courses?.map((course) => (
                  <SidebarMenuItem key={course._id} className={"flex"}>
                    <SidebarMenuButton asChild>
                      <Link to={`/${authUser?.role}/${course?._id}`}>
                        <span>{course.subject}</span>
                      </Link>
                    </SidebarMenuButton>
                    {authUser?.role === "student" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="ml-2">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => deleteCourse(course?._id)} className="text-red-500">
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  {/* Uncomment if you want to add a course button */}
                  {/* {authUser ?.role === "instructor" && (
                    <SidebarMenuButton asChild>
                      <button className="flex items-center">
                        <Plus className="mr-2" />
                        <span>Add Course</span>
                      </button>
                    </SidebarMenuButton>
                  )} */}
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section for ModeToggle and LogoutButton */}
        <div className="absolute flex justify-between w-10/12 items-center bottom-4 left-4 z-20">
          {/* <ModeToggle /> */}
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="ml-2 font-medium">{authUser?.fullName}</span>
              <span className="ml-2 opacity-80">{authUser?.role}</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <LogoutButton />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

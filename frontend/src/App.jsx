import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import ModeToggle from "./components/ModeToggle";
import { Navigate, Route, Routes } from "react-router";

import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "./lib/axios";
import LogoutButton from "./components/LogoutButton";
import InstructorPage from "./pages/InstructorPage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const { data: authUser, isFetching } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/auth/me");

        if (res.data.error) throw new Error(error);

        return res.data;
      } catch (error) {
        console.log(error.response.data.error);
        return null;
      }
    },
  });

  return (
    <>
      {authUser && <AppSidebar />}
      <main className="w-full h-screen">
        {authUser && <SidebarTrigger />}

        <div className="p-8">
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
            <Route
              path="/instructor/:id"
              element={authUser && authUser?.role === "instructor" ? <InstructorPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/student/:id"
              element={authUser && authUser?.role === "student" ? <StudentPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/admin"
              element={authUser && authUser?.role === "admin" ? <AdminPage /> : <Navigate to={"/login"} />}
            />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
          </Routes>
        </div>

        <div className="absolute flex gap-36 items-center top-0 right-0 z-20 m-4">
          <ModeToggle />
          {/* <div>{authUser && <LogoutButton />}</div> */}
        </div>

        <Toaster />
      </main>
    </>
  );
}

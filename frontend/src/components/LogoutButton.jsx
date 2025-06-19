import React from "react";
import { Button } from "./ui/button";
import { Loader2Icon, LogOut } from "lucide-react";
import useAuthHooks from "../hooks/auth.hooks";
import { useQuery } from "@tanstack/react-query";

const LogoutButton = () => {
  const { logout, logoutIsPending } = useAuthHooks();
  return (
    <Button variant={"outline"} onClick={() => logout()}>
      {logoutIsPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <LogOut className="text-slate-700 relative z-500 hover:text-red-500" size={10} />
      )}
    </Button>
  );
};

export default LogoutButton;

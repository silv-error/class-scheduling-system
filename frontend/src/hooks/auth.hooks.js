import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const useAuthHooks = () => {
  const queryClient = useQueryClient();

  const { mutate: signup, isPending: signupIsPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (formData) => {
      try {
        const res = await axios.post("/auth/signup", formData);
        if (res.status !== 201) throw new Error(data.error || "Something went wrong");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.error, { id: "signup" });
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: login, isPaused: loginIsPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (formData) => {
      try {
        const res = await axios.post("/auth/login", formData);
        if (res.status !== 200) throw new Error(data.error || "Something went wrong");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.error, { id: "login" });
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: logout, isPending: logoutIsPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        const res = await axios.post("/auth/logout");
        if (res.status !== 200) throw new Error(data.error || "Something went wrong");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.error, { id: "logout" });
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { signup, signupIsPending, login, loginIsPending, logout, logoutIsPending };
};

export default useAuthHooks;

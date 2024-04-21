"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserInfo } from "@/routes/user-routes";
import { useUserToken } from "./useUserToken";
import { useRouter } from "next/navigation";

export function useUserProjects() {
  const router = useRouter();
  const jwtToken = useUserToken();
  const {
    isPending,
    error,
    data: response,
  } = useQuery({
    queryKey: ["user/me", jwtToken as string],
    queryFn: () => getUserInfo(jwtToken as string),
    enabled: !!jwtToken,
  });

  useEffect(() => {
    if (response?.data) {
      if (response.data.projects.length === 1) {
        localStorage.setItem(
          "projectId",
          response.data.projects[0].project._id
        );
        router.replace(`/home/${response.data.projects[0].project._id}`);
      } else if (response.data.projects.length > 1) {
        console.log("Have more than 1 project", response.data.projects);
        localStorage.setItem(
          "projectId",
          response.data.projects[0].project._id
        );
        router.replace(`/home/${response.data.projects[0].project._id}`);
        // Show the list of projects
        // You need to handle this part according to your application's logic
      } else {
        router.replace("/create-project");
      }
    }
  }, [router, response]);

  return {
    isPending,
    error,
    response,
    hasInvite: response?.data?.invitedProjectsLength > 0,
  };
}

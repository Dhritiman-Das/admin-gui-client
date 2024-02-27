"use client";
import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import { defaultRoute } from "@/lib/constants/routers";
import { getUserInfo } from "@/routes/user-routes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { MySession } from "./api/auth/[...nextauth]/route";
import { useRouter } from "next/navigation";

export default function HomeContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const jwtToken = (session as MySession)?.userToken;
  console.log({ jwtToken });

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
      }
    }
  }, [router, response]);
  if (isPending) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  return <LoadingScreen />;
}

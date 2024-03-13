"use client";
import LoadingScreen from "@/components/loadingScreen";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useUserProjects } from "../hooks/useUserProjects";
import ErrorScreen from "@/components/errorScreen";

export default function Page() {
  const { isPending, error, response } = useUserProjects();
  if (error) return <ErrorScreen error={error} />;
  if (isPending) return <LoadingScreen />;
  return <LoadingScreen />;
}

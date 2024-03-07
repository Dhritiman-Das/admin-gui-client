"use client";
import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import React from "react";
import { useUserProjects } from "./hooks/useUserProjects";

export default function HomeContent() {
  const { isPending, error, response } = useUserProjects();

  if (isPending) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  return <LoadingScreen />;
}

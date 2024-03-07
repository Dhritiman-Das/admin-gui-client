"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getSessionFn, getUserInfo } from "@/routes/user-routes";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";
import Error from "next/error";
import ErrorScreen from "@/components/errorScreen";
import CreateProjectForm from "./create-project-form";
import { H4 } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import AppLogo from "@/components/essentials/app-logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useUserProjects } from "../hooks/useUserProjects";

export default async function page() {
  const { isPending, error, response } = useUserProjects();
  if (error) return <ErrorScreen error={error} />;
  if (isPending) return <LoadingScreen />;
  return (
    <div className="container">
      <div className="flex items-center justify-between py-2">
        <AppLogo />
        <ModeToggle />
      </div>
      <Card className="px-20 py-10">
        <H4>Create your first project</H4>
        <CreateProjectForm />
      </Card>
    </div>
  );
}

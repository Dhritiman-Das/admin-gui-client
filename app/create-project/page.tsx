"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

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
import { Button } from "@/components/ui/button";
import ProjectInviteList from "./project-invite-list";

export default async function Page() {
  const { isPending, error, response, hasInvite } = useUserProjects();
  const [currentStep, setCurrentStep] = React.useState<
    "choose-invite" | "create-project"
  >("create-project");

  useEffect(() => {
    console.log({ hasInvite });

    if (hasInvite) setCurrentStep("choose-invite");
  }, [hasInvite]);

  if (error) return <ErrorScreen error={error} />;
  if (isPending) return <LoadingScreen />;
  return (
    <div className="h-screen w-screen relative">
      <div className="absolute top-0 w-full">
        <div className="container flex items-center justify-between py-2">
          <AppLogo />
          <ModeToggle />
        </div>
      </div>
      <div className="container h-screen flex justify-center items-center">
        <Card className="px-20 py-10 w-full md:w-[800px]">
          {currentStep === "create-project" ? (
            <>
              <H4>Create your first project {hasInvite}</H4>
              <CreateProjectForm />
              {hasInvite && (
                <Button
                  className="px-0"
                  variant={"link"}
                  onClick={() => setCurrentStep("choose-invite")}
                >
                  Choose from invited projects
                </Button>
              )}
            </>
          ) : (
            <>
              <H4>Invitation list</H4>
              <ProjectInviteList />
              <Button
                className="px-0"
                variant={"link"}
                onClick={() => setCurrentStep("create-project")}
              >
                Create new project
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

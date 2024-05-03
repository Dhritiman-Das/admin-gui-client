"use client";
import { Badge } from "@/components/ui/badge";
import { H2 } from "@/components/ui/typography";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ReadValues from "./readValues";
import EditValues from "./editValues";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectInfo,
  getServerIP,
  updateProject,
} from "@/routes/project-routes";
import { Project, ProjectEdit } from "@/types/project";
import { toast } from "sonner";
import { AuthRequiredError } from "@/lib/exceptions";
import { useMutation } from "@/app/hooks/customMutation";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { useUserToken } from "@/app/hooks/useUserToken";
import LoadingPageWithTables from "@/components/loadingPageWithTables";

export default function Page() {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const [project, setProject] = React.useState<Project>();
  const [serverIpVal, setServerIpVal] = React.useState<string>("");
  const [projectEdit, setProjectEdit] = React.useState<ProjectEdit>();
  const [currentProjectId, setCurrentProjectId] = React.useState<string>("");
  const {
    isPending,
    error,
    data: response,
  } = useQuery({
    queryKey: [`${currentProjectId}/project`],
    queryFn: () => getProjectInfo(currentProjectId, jwtToken as string),
    enabled: !!jwtToken && !!currentProjectId,
  });

  const {
    isPending: isServerIpPending,
    error: serverIpError,
    data: serverIp,
  } = useQuery({
    queryKey: [`${currentProjectId}/project/server-ip`],
    queryFn: () => getServerIP(),
  });
  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user/me"],
      });
      queryClient.invalidateQueries({
        queryKey: [`${currentProjectId}/project`],
      });
    },
  });
  const [editView, setEditView] = React.useState(false);
  const toggleEditView = () => setEditView(!editView);
  useEffect(() => {
    setCurrentProjectId(localStorage.getItem("projectId") as string);
  }, []);
  useEffect(() => {
    if (response?.status === 200) {
      const {
        mode,
        name,
        description,
        dbConnectionString,
        createdAt,
        updatedAt,
        _id,
      } = response.data;
      setProject({
        mode,
        name,
        description,
        dbConnectionString,
        createdAt,
        updatedAt,
        _id,
      });
      setProjectEdit({ mode, name, description, dbConnectionString });
    }
  }, [response]);

  useEffect(() => {
    if (serverIp?.status === 200) {
      setServerIpVal(serverIp.data.ip);
    }
  }, [serverIp]);

  useEffect(() => {
    console.log({ projectEdit });
  }, [projectEdit]);
  const handleSave = async () => {
    updateProjectMutation.mutate(
      {
        projectId: currentProjectId,
        project: projectEdit,
        token: jwtToken as string,
      },
      {
        onError: (
          error: Error & {
            response?: { data: { message: string } };
          }
        ) => {
          console.log({ error });

          // Handle the error when mutation fails
          toast.error(
            error?.response?.data?.message || "Error updating project"
          );
        },
        onSuccess: () => {
          // Handle the scenario when mutation is successful
          toggleEditView();
        },
      }
    );
  };
  if (isPending) return <LoadingPageWithTables />;
  if (error) return <ErrorScreen error={error} />;
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Project</H2>
          <Badge variant={"outline"}>
            {project?.mode === "personal"
              ? "Personal"
              : project?.mode === "team"
              ? "Team"
              : "Loading..."}
          </Badge>
        </div>
        {editView ? (
          <div className="flex gap-2">
            <Button variant={"ghost"} onClick={toggleEditView}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={updateProjectMutation.isPending}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="rounded-full"
            size="icon"
            onClick={toggleEditView}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="content flex flex-col gap-4">
        {editView ? (
          <EditValues
            toggleEditView={toggleEditView}
            project={projectEdit as ProjectEdit}
            editProject={(val: ProjectEdit) => setProjectEdit(val)}
          />
        ) : (
          <ReadValues
            toggleEditView={toggleEditView}
            project={project}
            isPending={isPending}
            serverIp={serverIpVal}
            isServerIpPending={isServerIpPending}
          />
        )}
      </div>
    </>
  );
}

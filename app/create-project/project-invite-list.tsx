import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useUserToken } from "../hooks/useUserToken";
import {
  getUserProjectInvites,
  handleProjectInvite,
} from "@/routes/user-routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHoverCard } from "@/components/essentials/profileHoverCard";
import { Profile } from "@/app/home/[projectId]/query/columns";
import { useMutation } from "../hooks/customMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/helpers";

type Project = {
  project: {
    _id: string;
    name: string;
    admin: Profile;
    mode: "team" | "personal";
  };
  role: "admin" | "developer" | "support";
};

export default function ProjectInviteList() {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const router = useRouter();
  const {
    data: getInvitedProjects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user/projects/invited", jwtToken as string],
    queryFn: () => getUserProjectInvites(jwtToken as string),
    enabled: !!jwtToken,
  });

  const handleInviteMutation = useMutation({
    mutationFn: handleProjectInvite,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user/projects/invited", jwtToken as string],
      });
      queryClient.invalidateQueries({
        queryKey: ["user/me", jwtToken as string],
      });
      if (variables.accept) {
        const projectId = data.data.project;
        router.push(`/home/${projectId}/query`);
      }
      toast.success(
        variables.accept ? "Invitation accepted" : "Invitation rejected"
      );
    },
  });

  if (isLoading) return <div className="">Loading...</div>;
  if (error) return <div className="">Error...</div>;
  if (!getInvitedProjects?.data.length)
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle>No Invites</CardTitle>
          <CardDescription>You have no pending invites</CardDescription>
        </CardHeader>
      </Card>
    );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 max-h-[calc(100vh-350px)] overflow-y-auto">
        {getInvitedProjects?.data.map((project: Project) => {
          return (
            <Card className="" key={project.project._id}>
              <CardHeader>
                <div className="flex gap-4">
                  <CardTitle className="text-[18px]">
                    {project.project.name}
                  </CardTitle>
                  <Badge>{capitalizeFirstLetter(project.project.mode)}</Badge>
                </div>
                <CardDescription>{project.project._id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 items-center">
                  <h6 className="w-[100px]">Admin</h6>
                  <ProfileHoverCard profile={project.project.admin} />
                </div>
                <div className="flex gap-2 items-center">
                  <h6 className="w-[100px]">Role</h6>
                  <h6>{capitalizeFirstLetter(project.role)}</h6>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={async () => {
                      handleInviteMutation.mutate({
                        token: jwtToken,
                        accept: true,
                        projectId: project.project._id,
                      });
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant={"secondary"}
                    onClick={async () => {
                      handleInviteMutation.mutate({
                        token: jwtToken,
                        accept: false,
                        projectId: project.project._id,
                      });
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}

import { Label } from "@/components/ui/label";
import { P } from "@/components/ui/typography";
import React from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReadValues({
  toggleEditView,
  project,
  isPending,
}: {
  toggleEditView: () => void;
  project: Project | undefined;
  isPending: boolean;
}) {
  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="projectName">Project name</Label>
        {isPending ? (
          <Skeleton className="h-4 w-[350px]" />
        ) : (
          <p>{project?.name || "No name"}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        {isPending ? (
          <>
            <Skeleton className="h-4 w-[450px]" />
            <Skeleton className="h-4 w-[450px]" />
          </>
        ) : (
          <p>{project?.description || "No description"}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="dbConnectionString">DB connection URI</Label>
        {isPending ? (
          <Skeleton className="h-4 w-[450px]" />
        ) : (
          <p>{project?.dbConnectionString || "No URI"}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="dbConnectionString">Created on</Label>
        {isPending ? (
          <Skeleton className="h-4 w-[250px]" />
        ) : (
          <p>
            {project?.createdAt
              ? new Date(project.createdAt).toLocaleString()
              : "Date not found"}
          </p>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="dbConnectionString">Last updated</Label>
        {isPending ? (
          <Skeleton className="h-4 w-[250px]" />
        ) : (
          <p>
            {project?.updatedAt
              ? new Date(project.updatedAt).toLocaleString()
              : "Date not found"}
          </p>
        )}
      </div>
      <Button className="w-fit" variant={"destructive"}>
        Delete
      </Button>
    </>
  );
}

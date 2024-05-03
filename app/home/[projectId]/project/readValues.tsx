import { Label } from "@/components/ui/label";
import { P } from "@/components/ui/typography";
import React from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import {
  blurMongoCredentials,
  capitalizeFirstLetter,
  formatDate,
  getLocalTime,
} from "@/lib/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SingleRowInfo from "./singleRowInfo";

export default function ReadValues({
  toggleEditView,
  project,
  isPending,
  serverIp,
  isServerIpPending,
}: {
  toggleEditView: () => void;
  project: Project | undefined;
  isPending: boolean;
  serverIp: string;
  isServerIpPending: boolean;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
          <CardDescription>Basic info about your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <SingleRowInfo
              label="Project ID"
              value={project?._id ?? "No ID"}
              isPending={isPending}
              copy
            />
            <SingleRowInfo
              label="Name"
              value={project?.name ?? "No name"}
              isPending={isPending}
            />
            <SingleRowInfo
              label="Description"
              value={project?.description ?? "No description"}
              isPending={isPending}
            />
            <SingleRowInfo
              label="Mode"
              value={capitalizeFirstLetter(project?.mode ?? "No mode")}
              isPending={isPending}
            />
            <SingleRowInfo
              label="Created at"
              value={formatDate(String(project?.createdAt)) ?? "No time"}
              isPending={isPending}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Database info</CardTitle>
          <CardDescription>Basic info about your database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <SingleRowInfo
              label="Database connection string"
              value={blurMongoCredentials(
                project?.dbConnectionString ?? "No database connected"
              )}
              isPending={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Server</CardTitle>
          <CardDescription>
            Basic info about your server of this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <SingleRowInfo
              label="Server IP"
              value={serverIp ?? "No IP address found"}
              isPending={isServerIpPending}
              copy
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

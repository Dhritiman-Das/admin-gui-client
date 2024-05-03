import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectEdit } from "@/types/project";
import React from "react";

export default function EditValues({
  toggleEditView,
  project,
  editProject,
}: {
  toggleEditView: () => void;
  project: ProjectEdit;
  editProject: (project: ProjectEdit) => void;
}) {
  return (
    <>
      <div className="grid w-full max-w-xl items-center gap-1.5">
        <Label htmlFor="projectName">Project name</Label>
        <Input
          type="text"
          id="projectName"
          placeholder="My first project"
          value={project?.name}
          onChange={(e) => {
            editProject({ ...project, name: e.target.value });
          }}
        />
      </div>
      <div className="grid w-full max-w-xl items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="My first project description"
          value={project?.description}
          onChange={(e) => {
            editProject({ ...project, description: e.target.value });
          }}
        />
      </div>
      <div className="grid w-full max-w-xl items-center gap-1.5">
        <Label htmlFor="dbConnectionString">DB connection URI</Label>
        <Input
          type="text"
          id="dbConnectionString"
          placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>"
          value={""}
          onChange={(e) => {
            editProject({ ...project, dbConnectionString: e.target.value });
          }}
        />
      </div>
    </>
  );
}

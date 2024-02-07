import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function EditValues({
  toggleEditView,
}: {
  toggleEditView: () => void;
}) {
  return (
    <>
      <div className="grid w-full max-w-xl items-center gap-1.5">
        <Label htmlFor="projectName">Project name</Label>
        <Input type="text" id="projectName" placeholder="My first project" />
      </div>
      <div className="grid w-full max-w-xl items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="My first project description" />
      </div>
      <div className="grid w-full max-w-xl items-center gap-1.5">
        <Label htmlFor="dbConnectionString">DB connection URI</Label>
        <Input
          type="text"
          id="dbConnectionString"
          placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>"
        />
      </div>
    </>
  );
}

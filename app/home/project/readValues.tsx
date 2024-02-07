import { Label } from "@/components/ui/label";
import { P } from "@/components/ui/typography";
import React from "react";

export default function ReadValues({
  toggleEditView,
}: {
  toggleEditView: () => void;
}) {
  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="projectName">Project name</Label>
        <p>My first project</p>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <p>My first project description</p>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="dbConnectionString">DB connection URI</Label>
        <p>
          {"mongodb+srv://iamdhritiman01:******@cluster0.mongodb.net/<dbname>"}
        </p>
      </div>
    </>
  );
}

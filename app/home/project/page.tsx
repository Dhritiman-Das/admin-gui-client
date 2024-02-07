"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { H2, H3, H4, P } from "@/components/ui/typography";
import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ReadValues from "./readValues";
import EditValues from "./editValues";

export default function page() {
  const { data: session, status } = useSession();
  const [editView, setEditView] = React.useState(false);
  const toggleEditView = () => setEditView(!editView);
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Project</H2>
          <Badge variant={"outline"}>Personal</Badge>
        </div>
        {editView ? (
          <div className="flex gap-2">
            <Button variant={"ghost"} onClick={toggleEditView}>
              Cancel
            </Button>
            <Button onClick={toggleEditView}>Save</Button>
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
          <EditValues toggleEditView={toggleEditView} />
        ) : (
          <ReadValues toggleEditView={toggleEditView} />
        )}
      </div>
    </>
  );
}

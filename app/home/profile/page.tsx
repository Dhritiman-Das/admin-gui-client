import { H2 } from "@/components/ui/typography";
import React from "react";
import EditProfileDialog from "./editProfileDialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ProfileView from "./profileView";

export default function page() {
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Profile</H2>
        </div>
        <EditProfileDialog
          activateBtn={
            <Button variant="ghost" className="rounded-full" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
      </div>
      <ProfileView />
    </>
  );
}

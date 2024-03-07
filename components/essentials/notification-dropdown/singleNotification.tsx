import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function SingleNotification({
  image,
  name,
  createdAt,
  isLast,
  seen,
}: {
  image: string;
  name: string;
  createdAt: string;
  isLast: boolean;
  seen: boolean;
}) {
  return (
    <>
      <div className={`flex gap-4 p-2 ${!!!seen && "bg-muted"}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={"https://avatars.githubusercontent.com/u/56109473?v=4"}
            alt={""}
          />
          <AvatarFallback>DD</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">Dhritiman Das</p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleString()}
            </p>
          </div>
          <p className="font-light">Added you as an admin</p>
        </div>
      </div>
      {!!!isLast ? <Separator /> : null}
    </>
  );
}

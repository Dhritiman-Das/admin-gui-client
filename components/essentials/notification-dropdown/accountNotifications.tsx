import React from "react";
import SingleNotification from "./singleNotification";

export default function AccountNotifications() {
  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto scroll-p-0">
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={false}
        name=""
        seen={true}
      />
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        profilePic=""
        createdAt=""
        isLast={true}
        name=""
        seen={false}
      />
    </div>
  );
}

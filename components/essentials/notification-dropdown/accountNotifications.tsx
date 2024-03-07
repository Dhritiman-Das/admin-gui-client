import React from "react";
import SingleNotification from "./singleNotification";

export default function AccountNotifications() {
  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto scroll-p-0">
      <SingleNotification
        image=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        image=""
        createdAt=""
        isLast={false}
        name=""
        seen={true}
      />
      <SingleNotification
        image=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        image=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        image=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        image=""
        createdAt=""
        isLast={false}
        name=""
        seen={false}
      />
      <SingleNotification
        image=""
        createdAt=""
        isLast={true}
        name=""
        seen={false}
      />
    </div>
  );
}

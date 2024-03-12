import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function LoadingPageWithTables() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Skeleton className="h-[40px] w-[160px]" />
        <Skeleton className="h-[40px] w-[100px]" />
      </div>
      <div className="">
        <Skeleton className="h-[30px] w-[150px]" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[40px]" />
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
      </div>
    </div>
  );
}

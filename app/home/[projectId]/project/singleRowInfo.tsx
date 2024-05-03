import CopyToClipboard from "@/components/copyToClipboard";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SingleRowInfo({
  label,
  value,
  isPending,
  copy = false,
}: {
  label: string;
  value: string;
  isPending: boolean;
  copy?: boolean;
}) {
  return (
    <div className="flex flex-col lg:flex-row flex-wrap">
      <div className="min-w-[300px]">
        <Label>{label}</Label>
      </div>
      <div className="flex-grow overflow-auto">
        {isPending ? (
          <Skeleton className="w-[200px]" />
        ) : (
          <div className="break-words text-sm flex items-center gap-2">
            {value} {copy ? <CopyToClipboard value={value} /> : null}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackIcon() {
  const router = useRouter();
  return (
    <Button
      variant="icon"
      onClick={() => {
        router.back();
      }}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
}

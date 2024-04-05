import React from "react";
import { H1, H4 } from "../ui/typography";

export default function InBeta() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <H1>Coming soon!</H1>
        <H4>This feature is currently in testing</H4>
      </div>
    </div>
  );
}

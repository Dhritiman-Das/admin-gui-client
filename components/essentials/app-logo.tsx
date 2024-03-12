import { DatabaseZap } from "lucide-react";
import React from "react";

export default function AppLogo({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  let iconSize;
  switch (size) {
    case "sm":
      iconSize = 16;
      break;
    case "md":
      iconSize = 24;
      break;
    case "lg":
      iconSize = 32;
      break;
    default:
      iconSize = 24;
  }

  return (
    <div
      className={`flex items-center gap-2 ml-2 ${
        size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : ""
      }`}
    >
      <DatabaseZap size={iconSize} />
      <p className="font-semibold tracking-wider">EasyDB</p>
    </div>
  );
}

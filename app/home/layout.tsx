import Sidebar from "@/components/Sidebar";
import { dimensions } from "@/lib/constants/dimensions";
import React from "react";
import ReactQueryProvider from "./reactQueryClientProvider";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <Sidebar />
      <div
        className={`main-content`}
        style={{ paddingLeft: dimensions.sidebarWidth }}
      >
        <div className="container py-4">{children}</div>
      </div>
    </div>
  );
}

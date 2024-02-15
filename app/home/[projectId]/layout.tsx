"use client";
import React, { useEffect } from "react";

export default function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  useEffect(() => {
    localStorage.setItem("projectId", params.projectId);
  }, []);
  return <>{children}</>;
}

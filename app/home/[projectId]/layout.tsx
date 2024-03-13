"use client";
import React, { useEffect } from "react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  useEffect(() => {
    localStorage.setItem("projectId", params.projectId);
  }, [params.projectId]);
  return <>{children}</>;
}

"use client";
import React, { useEffect } from "react";
import LoadingScreen from "@/components/loadingScreen";
import { useRouter, usePathname } from "next/navigation";

export default function Page({
  params,
}: {
  params: {
    projectId: string;
    queryId: string;
  };
}) {
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    router.replace(pathName + "/view");
  }, []);
  return <LoadingScreen />;
}

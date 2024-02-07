"use client";
import LoadingScreen from "@/components/loadingScreen";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home/project");
  }, [router]);
  return <LoadingScreen />;
}

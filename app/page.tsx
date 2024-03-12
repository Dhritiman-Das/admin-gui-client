"use client";
import { useSession } from "next-auth/react";
import LandingPage from "./landingPage";
import HomeContent from "./home";
import { useQuery } from "@tanstack/react-query";
import { getSessionFn } from "@/routes/user-routes";
import LoadingScreen from "@/components/loadingScreen";

export default function Home() {
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["user/session"],
    queryFn: () => getSessionFn(),
  });
  console.log({ sessionData });
  if (isLoading) {
    <LoadingScreen />;
  }
  if (!!!sessionData?.data) {
    return <LandingPage />;
  } else {
    return <HomeContent />;
  }
}

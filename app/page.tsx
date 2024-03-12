"use client";
import { useSession } from "next-auth/react";
import LandingPage from "./landingPage";
import HomeContent from "./home";
import { useQuery } from "@tanstack/react-query";
import { getSessionFn } from "@/routes/user-routes";
import LoadingScreen from "@/components/loadingScreen";

export default function Home() {
  const {
    data: sessionData,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["user/session"],
    queryFn: () => getSessionFn(),
  });
  console.log({ sessionData });

  if (!!!sessionData?.data && !!isFetched) {
    return <LandingPage />;
  } else if (!!sessionData?.data) {
    return <HomeContent />;
  } else {
    return <LoadingScreen />;
  }
}

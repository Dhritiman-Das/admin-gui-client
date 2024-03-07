"use client";
import { useSession } from "next-auth/react";
import LandingPage from "./landingPage";
import HomeContent from "./home";
import { useQuery } from "@tanstack/react-query";
import { getSessionFn } from "@/routes/user-routes";

export default function Home() {
  const { data: sessionData } = useQuery({
    queryKey: ["user/session"],
    queryFn: () => getSessionFn(),
  });
  console.log({ sessionData });
  if (!!!sessionData?.data) {
    return <LandingPage />;
  } else {
    return <HomeContent />;
  }
}

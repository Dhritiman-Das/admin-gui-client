"use client";
import { useSession } from "next-auth/react";
import LandingPage from "./landingPage";
import HomeContent from "./home";

export default function Home() {
  const { data: session, status } = useSession();
  console.log({ session, status });
  if (!!!session) {
    return <LandingPage />;
  } else {
    return <HomeContent />;
  }
}

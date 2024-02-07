import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import { defaultRoute } from "@/lib/constants/routers";
import { getUserInfo } from "@/routes/user-routes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MySession } from "./api/auth/[...nextauth]/route";

export default function HomeContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const jwtToken = (session as MySession)?.userToken;
  console.log({ jwtToken });

  const {
    isPending,
    error,
    data: response,
  } = useQuery({
    queryKey: ["user/me", jwtToken as string],
    queryFn: () => getUserInfo(jwtToken as string),
    enabled: !!jwtToken,
  });
  useEffect(() => {
    if (response?.data) router.replace(defaultRoute);
  }, [router, response]);
  if (isPending) return <LoadingScreen />;
  if (error) return <ErrorScreen errorMessage={error.message} />;
  return <LoadingScreen />;
}

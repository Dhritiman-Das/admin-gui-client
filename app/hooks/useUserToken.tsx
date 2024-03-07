// "use client";
// import { Session } from "next-auth";
// import { useSession } from "next-auth/react";

import { getSessionFn } from "@/routes/user-routes";
import { useQuery } from "@tanstack/react-query";

export function useUserToken() {
  // const { data: session } = useSession();
  // const jwtToken = (session as Session)?.userToken;

  // return jwtToken;
  const { data: sessionData } = useQuery({
    queryKey: ["user/session"],
    queryFn: () => getSessionFn(),
  });
  return sessionData?.data?.userToken;
}

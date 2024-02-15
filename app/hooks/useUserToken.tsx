import { useSession } from "next-auth/react";
import { MySession } from "../api/auth/[...nextauth]/route";

export function useUserToken() {
  const { data: session } = useSession();
  const jwtToken = (session as MySession)?.userToken;

  return jwtToken;
}

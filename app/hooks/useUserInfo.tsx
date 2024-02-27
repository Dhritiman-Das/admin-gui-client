"use client";
import { verifyJwt } from "@/lib/jwt";
import { useUserToken } from "./useUserToken";

export function useUserInfo() {
  const jwtToken = useUserToken();
  const userCool = verifyJwt(jwtToken as string);
  console.log({ user: userCool });

  return userCool;
}

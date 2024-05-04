import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function LoginBtn() {
  return (
    <Link href={"auth/login"}>
      <Button variant={"secondary"}>Log in</Button>
    </Link>
  );
}

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function SigninBtn() {
  return (
    <Link href={"auth/signin"}>
      <Button>Sign up</Button>
    </Link>
  );
}

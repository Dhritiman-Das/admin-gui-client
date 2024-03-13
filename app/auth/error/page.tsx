"use client";
import AppLogo from "@/components/essentials/app-logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { H2, H4 } from "@/components/ui/typography";
import { signOut } from "next-auth/react";
import App from "next/app";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <>
      <nav className="fixed my-4 container">
        <AppLogo />
      </nav>
      <div className="container flex h-screen items-center">
        <Image
          className="w-7/12"
          alt="error_astronaut"
          src={"/illustrations/error_astronaut.png"}
          width={800}
          height={800}
        />
        <div className="w-5/12 flex flex-col items-center justify-center gap-4">
          <H2 className="self-start">Error</H2>
          <H4 className="self-start">{error}</H4>
          <div className="flex gap-4 self-start">
            <Button
              onClick={async () => {
                const data = await signOut({
                  redirect: false,
                  callbackUrl: "/",
                });
                router.push(data.url);
              }}
            >
              Logout
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
}

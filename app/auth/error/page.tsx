"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { H2, H4 } from "@/components/ui/typography";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function () {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <>
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
            <Button onClick={() => signOut()}>Logout</Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
}

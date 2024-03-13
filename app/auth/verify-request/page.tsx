"use client";
import AppLogo from "@/components/essentials/app-logo";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { H4, P } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const type = searchParams.get("type");

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="px-4">
        <div className="flex justify-between items-center pb-2">
          <AppLogo size="sm" />
          <ModeToggle />
        </div>
        <Card className="sm:w-[500px] w-full  px-14 py-10 bg-">
          <div className="flex flex-col items-center">
            <Image
              src={"/illustrations/open-email.svg"}
              width={70}
              height={70}
              alt="Open email"
              className="flex justify-center"
            />
            <H4>Check your email</H4>
          </div>
          <P>
            We have sent a sign-in link to your email address. Click on the link
            to sign in.
          </P>
          <P className="font-light text-[12px]">
            Didn&apos;t receive an email? Check your spam folder or{" "}
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="hover:underline"
            >
              Contact us
            </Link>
          </P>
        </Card>
      </div>
    </div>
  );
}

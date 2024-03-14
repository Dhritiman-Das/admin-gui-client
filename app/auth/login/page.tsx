import { UserAuthForm } from "@/app/authentication/components/user-auth-form";
import AppLogo from "@/components/essentials/app-logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <>
      <nav className="py-4 fixed flex items-center justify-between w-screen px-8">
        <AppLogo />
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <Link href="/auth/signin">
            <Button variant={"ghost"}>Sign in</Button>
          </Link>
        </div>
      </nav>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="lg:p-8 p-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to log in to your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

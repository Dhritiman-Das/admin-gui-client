import React from "react";
import AppLogo from "../essentials/app-logo";
import Link from "next/link";
import { Sign } from "crypto";
import SigninBtn from "./buttons/signinBtn";
import LoginBtn from "./buttons/loginBtn";
import { ModeToggle } from "../ui/mode-toggle";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full z-50">
      <div className="hidden md:block w-fit mx-auto border-solid border-2 border-secondary px-10 py-4 rounded-3xl mt-3 bg-background shadow-xl">
        <div className=" flex justify-center items-center gap-20">
          <div className="flex gap-2 items-center">
            <AppLogo />
            <ModeToggle />
          </div>
          <div className="flex gap-4">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/documentation">Docs</Link>
          </div>
          <div className="flex gap-2">
            <SigninBtn />
            <LoginBtn />
          </div>
        </div>
      </div>
      <div className="md:hidden container flex justify-between items-center mt-4">
        <div className="">
          <AppLogo />
        </div>
        <div className="flex gap-2">
          <SigninBtn />
          <LoginBtn />
        </div>
      </div>
    </div>
  );
}

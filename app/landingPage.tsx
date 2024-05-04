"use client";
import Features from "@/components/landing-page/features";
import { Hero } from "@/components/landing-page/hero";
import Navbar from "@/components/landing-page/navbar";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

export default function LandingPage() {
  // return (
  //   <section className="w-full h-screen flex items-center bg-gray-900">
  //     <div className="container px-4 md:px-6">
  //       <div className="flex flex-col items-center space-y-4 text-center">
  //         <div className="space-y-2">
  //           <h1 className="text-3xl font-bold tracking-tighter text-gray-50 sm:text-4xl md:text-5xl lg:text-6xl/none">
  //             Mongo Admin GUI
  //           </h1>
  //           <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl dark:text-gray-400">
  //             Manage your MongoDB databases with ease.
  //           </p>
  //         </div>
  //         <div className="space-x-4">
  //           <Button
  //             className="inline-flex h-9 items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
  //             onClick={() => signIn()}
  //           >
  //             Get Started
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
    </>
  );
}

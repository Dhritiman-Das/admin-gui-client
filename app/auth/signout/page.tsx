"use client";
import { useUserToken } from "@/app/hooks/useUserToken";
import AppLogo from "@/components/essentials/app-logo";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const jwtToken = useUserToken();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const signoutUser = async () => {
    setLoading(true);
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    router.push(data.url);
    setLoading(false);
  };

  return (
    <>
      <nav className="fixed container my-4">
        <AppLogo />
      </nav>
      <div className="w-screen h-screen flex items-center justify-center">
        <Card className="w-[450px] relative">
          <CardHeader>Are you sure you want to sign out?</CardHeader>
          <CardFooter className="flex gap-2 justify-end">
            <Button variant={"ghost"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={signoutUser}
              loading={loading}
            >
              Yes
            </Button>
          </CardFooter>
          <div className="absolute top-[-50px]">
            <Button variant={"outline"} onClick={() => router.back()}>
              <ChevronLeft />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

import {
  ChevronRight,
  Cloud,
  CreditCard,
  LifeBuoy,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useUserToken } from "@/app/hooks/useUserToken";
import { getUserInfo } from "@/routes/user-routes";
import { useState } from "react";
import Link from "next/link";
import { PROFILE_LINK } from "@/server/lib/constants";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

export function ProfileDropdown() {
  const jwtToken = useUserToken();
  const {
    isPending,
    error,
    data: userQuery,
  } = useQuery({
    queryKey: ["user/me", jwtToken as string],
    queryFn: () => getUserInfo(jwtToken as string),
    enabled: !!jwtToken,
  });
  if (isPending) {
    return (
      <>
        <div className="flex gap-1 items-center">
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
          <Skeleton className="h-[25px] w-full" />
        </div>
      </>
    );
  }
  //   const signoutUser = async () => {
  //     setLoading(true);
  //     await signOut();
  //     setLoading(false);
  //   };
  return (
    <>
      <div className="flex gap-1 items-center">
        <Avatar className="w-[40px]">
          <AvatarImage
            src={userQuery?.data?.image || ""}
            className="rounded-full h-[30px] w-[30px]"
          />
          <AvatarFallback>
            {userQuery?.data?.image?.slice(0, 2) || "DD"}
          </AvatarFallback>
        </Avatar>
        <div className="truncate text-sm">{userQuery?.data?.email || ""}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon">
              <ChevronRight />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/home/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/home/invitations">
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Invitations</span>
                  <DropdownMenuShortcut>
                    <Badge>4</Badge>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Cloud className="mr-2 h-4 w-4" />
              <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/api/auth/signout">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

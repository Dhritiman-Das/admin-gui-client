"use client";

import { useUserToken } from "@/app/hooks/useUserToken";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, H4, P } from "@/components/ui/typography";
import { getUserInfo } from "@/routes/user-routes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import EditProfileDialog, { ProfileFields } from "./editProfileDialog";
import { Button } from "@/components/ui/button";
import { Clock, Mail, Phone, Plus } from "lucide-react";
import { getLocalTime } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ProfileViewMoreOptions from "./profileViewMoreOptions";

export function TextComponent({
  text,
  type,
}: {
  text: string;
  type: "H3" | "H4" | "P";
}) {
  return (
    <div>
      {type === "H3" ? <H3 className="mt-0">{text}</H3> : null}
      {type === "H4" ? <H4 className="font-normal">{text}</H4> : null}
      {type === "P" ? <P>{text}</P> : null}
    </div>
  );
}

export function LabelValue({
  label,
  field,
  icon,
  type,
  showLabel = true,
  value,
  loading,
}: {
  label: string;
  field: ProfileFields;
  icon?: React.ReactNode;
  type: "H3" | "H4" | "P";
  showLabel?: boolean;
  value: string;
  loading: boolean;
}) {
  if (loading) return <Skeleton className="h-4 w-[300px]" />;
  else if (!!!value)
    return (
      <>
        <EditProfileDialog
          activateBtn={
            <div className="inline-flex w-fit font-normal text-sm text-blue-600 gap-2 items-center cursor-pointer hover:underline">
              <Plus />
              Add {label}
            </div>
          }
          autofocus={field}
        />
      </>
    );
  else if (icon) {
    return (
      <>
        <div className="flex gap-2">
          {icon}
          {value}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="info">
        {showLabel && <TextComponent text={label} type={type} />}
        {loading ? (
          <Skeleton className="h-4 w-[275px]" />
        ) : (
          <TextComponent text={value} type={type} />
        )}
      </div>
    </>
  );
}

export default function ProfileView() {
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
  return (
    <div className="flex flex-col gap-4">
      <div className="section flex gap-6">
        <div className="image">
          {isPending ? (
            <Skeleton className="h-[200px] w-[200px]" />
          ) : (
            <Image
              className="shadow-sm rounded-lg"
              src={userQuery?.data?.image || "/svgs/default-profile.svg"}
              alt="Profile"
              width={200}
              height={200}
            />
          )}
        </div>
        <div className="basicInfo flex flex-col gap-2">
          <LabelValue
            label="Name"
            field="name"
            type="H3"
            showLabel={false}
            value={userQuery?.data?.name}
            loading={isPending}
          />
          <LabelValue
            label="Title"
            field="title"
            type="H4"
            showLabel={false}
            value={userQuery?.data?.title}
            loading={isPending}
          />
          <LabelValue
            label="Pronounciation"
            field="namePronounciation"
            type="P"
            showLabel={false}
            value={userQuery?.data?.namePronounciation}
            loading={isPending}
          />
          <LabelValue
            label="Email"
            field="email"
            type="P"
            showLabel={false}
            value={userQuery?.data?.email}
            loading={isPending}
            icon={<Mail />}
          />
          <LabelValue
            label="Phone"
            field="telephone"
            type="P"
            showLabel={false}
            value={userQuery?.data?.telephone}
            loading={isPending}
            icon={<Phone />}
          />
          <LabelValue
            label="time-zone"
            field="timeZone"
            type="P"
            showLabel={false}
            value={getLocalTime(userQuery?.data?.timeZone)}
            loading={isPending}
            icon={<Clock />}
          />
        </div>
      </div>
      <div className="">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>About me</CardTitle>
              {!!!isPending && !!!userQuery?.data?.bio && (
                <EditProfileDialog
                  activateBtn={
                    <div className="inline-flex w-fit font-normal text-sm text-blue-600 gap-2 items-center cursor-pointer hover:underline">
                      <Plus />
                      Add Bio
                    </div>
                  }
                  autofocus={"bio"}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[50%]" />
                </div>
              </>
            ) : (
              userQuery?.data?.bio || (
                <div className="italic font-light">
                  Use this space to tell people about yourself.
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
      <div className="">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="py-2">
            {isPending && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-full" />
                <Separator />
                <Skeleton className="h-8 w-full" />
                <Separator />
                <Skeleton className="h-8 w-full" />
              </div>
            )}
            {!!!isPending &&
              userQuery?.data?.projects?.map(
                (projectObj: any, index: number) => (
                  <>
                    <div className="flex items-center justify-between gap-4 py-2">
                      <div className="w-[450px] truncate">
                        {projectObj.project.name}
                      </div>
                      <div className="flex gap-6">
                        <div className="">
                          <Badge variant={"outline"}>
                            {projectObj.project.mode}
                          </Badge>
                        </div>
                        <div className="w-[100px] text-center">
                          <Badge
                            className={` ${
                              projectObj.role === "support"
                                ? "bg-gray-600 hover:bg-gray-500"
                                : projectObj.role === "developer"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-green-600 hover:bg-green-500"
                            }`}
                          >
                            {projectObj.role}
                          </Badge>
                        </div>
                        <ProfileViewMoreOptions />
                      </div>
                    </div>
                    {userQuery?.data?.projects.length !== index + 1 && (
                      <Separator />
                    )}
                  </>
                )
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";
import BackIcon from "@/components/ui/back-icon";
import { H2, H4 } from "@/components/ui/typography";
import React, { useEffect } from "react";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { historyId: string; projectId: string };
}) {
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <BackIcon />
          <div className="flex gap-2 items-center">
            <H2>History</H2>
          </div>
        </div>
      </div>
      <div className="details pl-12 flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            {
              name: "History",
              href: `/home/${params.projectId}/history`,
              current: false,
            },
            { name: params.projectId, href: "#", current: true },
          ]}
        />
        <div className="flex justify-between">
          <H4>History details</H4>
        </div>
        {children}
      </div>
    </>
  );
}

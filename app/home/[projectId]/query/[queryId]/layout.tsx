"use client";
import BackIcon from "@/components/ui/back-icon";
import { H2, H4 } from "@/components/ui/typography";
import React, { useEffect } from "react";
import ActionButtons from "./action-buttons";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string; queryId: string };
}) {
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <BackIcon />
          <div className="flex gap-2 items-center">
            <H2>Query</H2>
          </div>
        </div>
      </div>
      <div className="details pl-12 flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            {
              name: "Query",
              href: `/home/${params.projectId}/query`,
              current: false,
            },
            { name: params.queryId, href: "#", current: true },
          ]}
        />
        <div className="flex justify-between">
          <H4>Query details</H4>
          <ActionButtons
            projectId={params.projectId}
            queryId={params.queryId}
          />
        </div>
        {children}
      </div>
    </>
  );
}

"use client";

import { H2 } from "@/components/ui/typography";
import React from "react";
import { DataTable } from "./data-table";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useQuery } from "@tanstack/react-query";
import { getUserProjectInvites } from "@/routes/user-routes";
import LoadingPageWithTables from "@/components/loadingPageWithTables";
import ErrorScreen from "@/components/errorScreen";
import { Columns } from "./columns";

export default function Page() {
  const jwtToken = useUserToken();
  const {
    data: getInvitedProjects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user/projects/invited", jwtToken as string],
    queryFn: () => getUserProjectInvites(jwtToken as string),
    enabled: !!jwtToken,
  });
  if (isLoading) return <LoadingPageWithTables />;
  if (error) return <ErrorScreen error={error} />;
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Invitations</H2>
        </div>
      </div>
      <div className="">
        <DataTable columns={Columns} data={getInvitedProjects?.data || []} />
      </div>
    </>
  );
}

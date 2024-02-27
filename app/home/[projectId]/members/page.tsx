"use client";
import { H2 } from "@/components/ui/typography";
import React, { useEffect, useState } from "react";
import AddMembersDialog from "./addMembersDialog";
import { DataTable } from "./data-table";
import { Member, columns } from "./columns";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/routes/project-routes";
import { useUserInfo } from "@/app/hooks/useUserInfo";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";

export default function ClientComponent({
  params,
}: {
  params: { projectId: string };
}) {
  const jwtToken = useUserToken();
  const projectId = params.projectId;
  const {
    isPending,
    error,
    isSuccess,
    data: getMembersData,
  } = useQuery({
    queryKey: [`${projectId}/members`],
    queryFn: () =>
      getMembers({ projectId: projectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!projectId,
  });
  const user = useUserInfo();
  console.log({ user });

  const [data, setData] = useState<Member[]>([]);
  useEffect(() => {
    console.log({ data });
  }, [data]);
  useEffect(() => {
    if (isSuccess) {
      console.log({
        queryData: getMembersData?.data,
      });

      setData(getMembersData?.data || []);
    }
  }, [isSuccess, getMembersData?.data]);
  if (isPending) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Members</H2>
        </div>
        <AddMembersDialog projectId={projectId} />
      </div>
      <div className="">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}

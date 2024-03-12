"use client";
import { H2 } from "@/components/ui/typography";
import React, { useEffect, useState } from "react";
import AddMembersDialog from "./addMembersDialog";
import { DataTable } from "./data-table";
import { Member, columns } from "./columns";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useQuery } from "@tanstack/react-query";
import { getInvitedMembers, getMembers } from "@/routes/project-routes";
import { useUserInfo } from "@/app/hooks/useUserInfo";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import LoadingPageWithTables from "@/components/loadingPageWithTables";

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
  const {
    isPending: isInvitedMembersPending,
    error: invitedMembersError,
    isSuccess: invitedMembersIsSuccess,
    data: getInvitedMembersData,
  } = useQuery({
    queryKey: [`${projectId}/members/invited`],
    queryFn: () =>
      getInvitedMembers({ projectId: projectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!projectId,
  });
  const user = useUserInfo();
  console.log({ user });

  const [membersList, setMembersList] = useState<Member[]>([]);
  const [invitedMembersList, setInvitedMembersList] = useState<Member[]>([]);
  useEffect(() => {
    console.log({ data: membersList });
  }, [membersList]);
  useEffect(() => {
    if (isSuccess) {
      setMembersList(getMembersData?.data || []);
    }
  }, [isSuccess, getMembersData?.data]);
  useEffect(() => {
    if (invitedMembersIsSuccess) {
      setInvitedMembersList(getInvitedMembersData?.data || []);
    }
  }, [invitedMembersIsSuccess, getInvitedMembersData?.data]);
  if (isPending) return <LoadingPageWithTables />;
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
        <DataTable
          columns={columns}
          data={[...membersList, ...invitedMembersList]}
        />
      </div>
    </>
  );
}

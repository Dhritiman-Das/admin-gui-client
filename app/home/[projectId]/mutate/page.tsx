"use client";
import { H2 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { getQueries } from "@/routes/project-routes";
import { useEffect, useState } from "react";
import { useUserToken } from "@/app/hooks/useUserToken";
import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import LoadingPageWithTables from "@/components/loadingPageWithTables";
import AddMutationDialog from "./addMutationDialog";
import EditMutationDialog from "./editMutationDialog";
import InBeta from "@/components/essentials/in-beta";
import { Columns, Mutation } from "./columns";
import { DataTable } from "./data-table";
import { getMutationsForProject } from "@/routes/mutation-routes";

export default function Page({ params }: { params: { projectId: string } }) {
  const jwtToken = useUserToken();

  const {
    isPending,
    error,
    isSuccess,
    data: getMutationsData,
  } = useQuery({
    queryKey: [`${params.projectId}/mutate`],
    queryFn: () =>
      getMutationsForProject({
        projectId: params.projectId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!params.projectId,
  });
  const [data, setData] = useState<Mutation[]>([]);
  useEffect(() => {
    if (isSuccess) {
      console.log({
        queryData: getMutationsData?.data,
      });

      setData(getMutationsData?.data || []);
    }
  }, [isSuccess, getMutationsData?.data]);
  if (isPending) return <LoadingPageWithTables />;
  if (error) return <ErrorScreen error={error} />;
  return <InBeta />;
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Mutation</H2>
        </div>
        <AddMutationDialog projectId={params.projectId} />
      </div>
      <div className="">
        <DataTable columns={Columns} data={data} />
      </div>
    </>
  );
}

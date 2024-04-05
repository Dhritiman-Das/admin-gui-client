"use client";
import { H2 } from "@/components/ui/typography";
import { DataTable } from "@/app/home/[projectId]/query/data-table";
import { useQuery } from "@tanstack/react-query";
import { getQueries } from "@/routes/project-routes";
import { useEffect, useState } from "react";
import { useUserToken } from "@/app/hooks/useUserToken";
import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import LoadingPageWithTables from "@/components/loadingPageWithTables";
import AddMutationDialog from "./addMutationDialog";
import { Mutation } from "./mutationDialog";
import EditMutationDialog from "./editMutationDialog";
import InBeta from "@/components/essentials/in-beta";

export default function Page({ params }: { params: { projectId: string } }) {
  const jwtToken = useUserToken();

  const {
    isPending,
    error,
    isSuccess,
    data: getQueriesData,
  } = useQuery({
    queryKey: [`${params.projectId}/query`],
    queryFn: () =>
      getQueries({ projectId: params.projectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!params.projectId,
  });
  const [data, setData] = useState<Mutation[]>([]);
  useEffect(() => {
    if (isSuccess) {
      console.log({
        queryData: getQueriesData?.data,
      });

      setData(getQueriesData?.data || []);
    }
  }, [isSuccess, getQueriesData?.data]);
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
        <EditMutationDialog projectId={params.projectId} />
      </div>
      <div className="">
        {/* <DataTable columns={Columns} data={data} /> */}
      </div>
    </>
  );
}

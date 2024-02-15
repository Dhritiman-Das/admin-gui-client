"use client";
import { H2 } from "@/components/ui/typography";
import AddQueryDialog from "./addQueryDialog";
import { DataTable } from "@/app/home/[projectId]/query/data-table";
import { Query, columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { getQueries } from "@/routes/project-routes";
import { useEffect, useState } from "react";
import { useUserToken } from "@/app/hooks/useUserToken";

export default function page({ params }: { params: { projectId: string } }) {
  const jwtToken = useUserToken();
  useEffect(() => {
    console.log(!!jwtToken);
  }, [jwtToken]);

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
  const [data, setData] = useState<Query[]>([]);
  useEffect(() => {
    if (isSuccess) {
      console.log({
        queryData: getQueriesData?.data,
      });

      setData(getQueriesData?.data || []);
    }
  }, [isSuccess, getQueriesData?.data]);
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>Query</H2>
        </div>
        <AddQueryDialog projectId={params.projectId} />
      </div>
      <div className="">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}

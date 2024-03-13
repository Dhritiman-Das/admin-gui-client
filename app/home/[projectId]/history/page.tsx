"use client";
import { H2 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUserToken } from "@/app/hooks/useUserToken";
import { getHistory } from "@/routes/history-routes";
import { History, Columns } from "./columns";
import { DataTable } from "./data-table";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import LoadingPageWithTables from "@/components/loadingPageWithTables";

export default function Page({ params }: { params: { projectId: string } }) {
  const jwtToken = useUserToken();
  const {
    isPending,
    error,
    isSuccess,
    data: getHistoryData,
  } = useQuery({
    queryKey: [`${params.projectId}/history`],
    queryFn: () =>
      getHistory({ projectId: params.projectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!params.projectId,
  });
  const [data, setData] = useState<History[]>([]);
  useEffect(() => {
    if (isSuccess) {
      setData(getHistoryData?.data || []);
    }
  }, [isSuccess, getHistoryData?.data]);
  if (isPending) return <LoadingPageWithTables />;
  if (error) return <ErrorScreen error={error} />;
  return (
    <>
      <div className="heading mb-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <H2>History</H2>
        </div>
      </div>
      <div className="">
        <DataTable columns={Columns} data={data} />
      </div>
    </>
  );
}

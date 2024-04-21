"use client";
import { useUserToken } from "@/app/hooks/useUserToken";
import ErrorScreen from "@/components/errorScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHistoryById } from "@/routes/history-routes";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";
import { History } from "../columns";
import { Badge } from "@/components/ui/badge";
import { SingleDetail } from "./singleDetail";

export default function Page({
  params,
}: {
  params: {
    projectId: string;
    historyId: string;
  };
}) {
  const jwtToken = useUserToken();
  const {
    isPending,
    error,
    isSuccess,
    data: queryData,
  } = useQuery({
    queryKey: [`${params.projectId}/history/${params.historyId}`],
    queryFn: () =>
      getHistoryById({
        historyId: params.historyId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!params.historyId,
  });
  const [data, setData] = React.useState<History>();
  const [queryHistory, setQueryHistory] = React.useState<{
    query: History["query"];
  }>();
  const [mutationHistory, setMutationHistory] = React.useState<{
    mutation: History["mutation"];
    mutationObjValues: History["mutationObjValues"];
  }>();

  useEffect(() => {
    if (data?.type === "query") {
      setQueryHistory({ query: data.query });
    }
    if (data?.type === "mutation") {
      setMutationHistory({
        mutation: data.mutation,
        mutationObjValues: data.mutationObjValues,
      });
    }
  }, [data]);
  useEffect(() => {
    if (queryData?.status === 200 && queryData?.data) {
      setData(queryData?.data);
    }
  }, [queryData]);
  if (error) return <ErrorScreen error={error} />;
  return (
    <div>
      {data?.type === "query" && (
        <>
          <SingleDetail
            header="Query"
            value={queryHistory?.query?.name || "Not found"}
            loading={isPending}
          />
        </>
      )}
      {data?.type === "mutation" && (
        <>
          <SingleDetail
            header="Mutation"
            value={mutationHistory?.mutation?.name || "Not found"}
            loading={isPending}
          />
        </>
      )}
      <SingleDetail
        header="Database"
        value={data?.query?.dbName || data?.mutation?.dbName || "Not found"}
        loading={isPending}
      />
      <SingleDetail
        header="Collection"
        value={
          data?.query?.dbCollectionName ||
          data?.mutation?.dbCollectionName ||
          "Not found"
        }
        loading={isPending}
      />
      <SingleDetail
        header="Query values"
        value={JSON.stringify(data?.queryValues) || "No query values"}
        loading={isPending}
      />
      {data?.type === "mutation" && (
        <SingleDetail
          header="Mutation values"
          value={
            JSON.stringify(data?.mutationObjValues) || "No mutation values"
          }
          loading={isPending}
        />
      )}
      <SingleDetail
        header="Status"
        value={
          data?.success ? (
            <Badge className="bg-emerald-500">Success</Badge>
          ) : (
            <Badge className="bg-red-500">Failed</Badge>
          )
        }
        loading={isPending}
      />
      <SingleDetail
        header="User"
        value={
          data?.user ? (
            <div className="flex gap-2 items-center">
              <Link href={"/users/" + data?.user._id}>
                <Avatar>
                  <AvatarImage
                    src={data.user.image}
                    alt={`@${data?.user._id}`}
                  />
                  <AvatarFallback>DD</AvatarFallback>
                </Avatar>
              </Link>
              <Link href={"/users/" + data?.user._id}>{data?.user.name}</Link>
            </div>
          ) : (
            "No author"
          )
        }
        loading={isPending}
      />
      <SingleDetail
        header="Created at"
        value={
          data?.createdAt
            ? new Date(data?.createdAt).toLocaleString()
            : "No date"
        }
        loading={isPending}
      />
    </div>
  );
}

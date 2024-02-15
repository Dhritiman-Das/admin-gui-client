"use client";
import { MySession } from "@/app/api/auth/[...nextauth]/route";
import { useUserToken } from "@/app/hooks/useUserToken";
import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgedQueries from "@/components/ui/badged-queries";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getHistoryById } from "@/routes/history-routes";
import { getQueries, getQuery } from "@/routes/project-routes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { History } from "../columns";
import { Badge } from "@/components/ui/badge";

export function SingleDetail({
  header,
  value,
  loading,
}: {
  header: string;
  value: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">
          {header}
        </dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {loading ? <Skeleton className="h-[20px] w-[150px]" /> : value}
        </dd>
      </div>
      <Separator />
    </>
  );
}
export default function page({
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
  useEffect(() => {
    if (queryData?.status === 200 && queryData?.data) {
      setData(queryData?.data);
    }
  }, [queryData]);
  if (error) return <ErrorScreen error={error} />;
  return (
    <div>
      <SingleDetail
        header="Query"
        value={data?.query.name || "Not found"}
        loading={isPending}
      />
      <SingleDetail
        header="Database"
        value={data?.query.dbName || "Not found"}
        loading={isPending}
      />
      <SingleDetail
        header="Collection"
        value={data?.query.dbCollectionName || "Not found"}
        loading={isPending}
      />
      <SingleDetail
        header="Query values"
        value={JSON.stringify(data?.queryValues) || "No query values"}
        loading={isPending}
      />
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
                    src={data.user.profilePic}
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

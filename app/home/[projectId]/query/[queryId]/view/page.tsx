"use client";

import { MySession } from "@/app/api/auth/[...nextauth]/route";
import ErrorScreen from "@/components/errorScreen";
import LoadingScreen from "@/components/loadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgedQueries from "@/components/ui/badged-queries";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getQuery } from "@/routes/project-routes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";

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
        <dt className="text-sm font-medium leading-6">{header}</dt>
        <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
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
    queryId: string;
  };
}) {
  const { data: session } = useSession();
  const jwtToken = (session as MySession)?.userToken;
  const {
    isPending,
    error,
    isSuccess,
    data: queryData,
  } = useQuery({
    queryKey: [`${params.projectId}/query/${params.queryId}`],
    queryFn: () =>
      getQuery({
        projectId: params.projectId,
        queryId: params.queryId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!params.queryId,
  });
  const [data, setData] = React.useState<{
    name: string;
    description: string;
    dbName: string;
    dbCollectionName: string;
    projection?: any;
    sort?: any;
    collation?: any;
    queryString: string;
    author: {
      name: string;
      profilePic: string;
      _id: string;
    };
    createdAt: string;
    updatedAt: string;
  }>();
  useEffect(() => {
    if (queryData?.status === 200 && queryData?.data) {
      setData(queryData?.data);
    }
  }, [queryData]);
  if (error) return <ErrorScreen error={error} />;
  return (
    <div>
      <SingleDetail
        header="Name"
        value={data?.name || "No name"}
        loading={isPending}
      />
      <SingleDetail
        header="Description"
        value={data?.description || "No description"}
        loading={isPending}
      />
      <SingleDetail
        header="Database"
        value={data?.dbName || "No database"}
        loading={isPending}
      />
      <SingleDetail
        header="Collection"
        value={data?.dbCollectionName || "No collection"}
        loading={isPending}
      />
      <SingleDetail
        header="Query"
        value={
          data?.queryString ? (
            <BadgedQueries inputString={data?.queryString} />
          ) : (
            "No query"
          )
        }
        loading={isPending}
      />
      <SingleDetail
        header="Projection"
        value={JSON.stringify(data?.projection) || "No collection"}
        loading={isPending}
      />
      <SingleDetail
        header="Sort"
        value={JSON.stringify(data?.sort) || "No collection"}
        loading={isPending}
      />
      <SingleDetail
        header="Collation"
        value={JSON.stringify(data?.collation) || "No collection"}
        loading={isPending}
      />
      <SingleDetail
        header="Author"
        value={
          data?.author ? (
            <div className="flex gap-2 items-center">
              <Link href={"/users/" + data?.author._id}>
                <Avatar>
                  <AvatarImage
                    src={data.author.profilePic}
                    alt={`@${data?.author._id}`}
                  />
                  <AvatarFallback>DD</AvatarFallback>
                </Avatar>
              </Link>
              <Link href={"/users/" + data?.author._id}>
                {data?.author.name}
              </Link>
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
      <SingleDetail
        header="Last updated"
        value={
          data?.createdAt
            ? new Date(data?.updatedAt).toLocaleString()
            : "No date"
        }
        loading={isPending}
      />
    </div>
  );
}

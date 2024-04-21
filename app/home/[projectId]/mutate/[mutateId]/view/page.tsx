"use client";

import { useUserToken } from "@/app/hooks/useUserToken";
import ErrorScreen from "@/components/errorScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgedQueries from "@/components/ui/badged-queries";
import { getQuery } from "@/routes/project-routes";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";
import { SingleDetail } from "../../../query/[queryId]/view/singleDetails";
import { getAMutation } from "@/routes/mutation-routes";

export default function Page({
  params,
}: {
  params: {
    projectId: string;
    mutateId: string;
  };
}) {
  const jwtToken = useUserToken();

  const {
    isPending,
    error,
    isSuccess,
    data: mutationData,
  } = useQuery({
    queryKey: [`${params.projectId}/mutate/${params.mutateId}`],
    queryFn: () =>
      getAMutation({
        mutationId: params.mutateId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!params.mutateId,
  });

  const [data, setData] = React.useState<{
    name: string;
    description: string;
    dbName: string;
    dbCollectionName: string;
    projection?: any;
    mutateObj?: {
      field: string;
      type: string;
      required: boolean;
    }[];
    queryString: string;
    author: {
      name: string;
      image: string;
      _id: string;
    };
    createdAt: string;
    updatedAt: string;
  }>();
  useEffect(() => {
    if (mutationData?.status === 200 && mutationData?.data) {
      setData(mutationData?.data);
    }
  }, [mutationData]);
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
        header="Mutate Object"
        value={JSON.stringify(data?.mutateObj) || "No collection"}
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
                    src={data.author.image}
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

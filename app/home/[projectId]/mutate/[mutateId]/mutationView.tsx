import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction } from "react";

export default function MutationView({
  projectId,
  mutationId,
  queryResult,
  onSuccessStateChange,
  onGoBack,
  setQueryResult,
}: {
  projectId: string;
  mutationId: string;
  queryResult: any;
  onSuccessStateChange: () => void;
  onGoBack: () => void;
  setQueryResult: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <div>Query result</div>
        <div
          onClick={() => onSuccessStateChange()}
          className="text-blue-500 cursor-pointer"
        >
          Edit
        </div>
      </div>
      <div className="mt-2">
        {queryResult ? (
          <pre className="text-sm">{JSON.stringify(queryResult, null, 2)}</pre>
        ) : (
          "No query result"
        )}
      </div>
      <div className="flex justify-end items-center gap-2">
        <Button variant={"ghost"} onClick={() => onGoBack()}>
          Back
        </Button>
        <Button onClick={() => onSuccessStateChange()}>Edit</Button>
      </div>
    </div>
  );
}

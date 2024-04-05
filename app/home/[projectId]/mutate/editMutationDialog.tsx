import { Button } from "@/components/ui/button";
import React from "react";
import MutationDialog from "./mutationDialog";

export default function EditMutationDialog({
  projectId,
}: {
  projectId: string;
}) {
  const handleEditMutationFn = () => {};
  const handleEditMutation = () => {};
  return (
    <MutationDialog
      type="edit"
      activateBtn={<Button>Edit Mutation</Button>}
      onSubmit={handleEditMutationFn}
      initialData={{
        name: "cool Name",
        description: "mutationDescription",
        dbCollectionName: "mutationDbCollectionName",
        dbName: "sample_airbnb",
        queryString: `{
            "name": "__nameVal__"
        }`,
        collation: "{}",
        projection: "{}",
        queryDataTypes: {},
        sort: "{}",
        mutateObj: [
          {
            field: "name",
            type: "string",
            required: true,
          },
        ],
      }}
    />
  );
}

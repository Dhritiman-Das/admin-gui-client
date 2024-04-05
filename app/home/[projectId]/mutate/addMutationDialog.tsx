import { Button } from "@/components/ui/button";
import React from "react";
import MutationDialog from "./mutationDialog";

export default function AddMutationDialog({
  projectId,
}: {
  projectId: string;
}) {
  const handleAddMutationFn = () => {};
  const handleAddMutation = () => {};
  return (
    <MutationDialog
      type="add"
      activateBtn={<Button>Add Mutation</Button>}
      onSubmit={handleAddMutationFn}
      // initialData={{
      //   name
      //   mutateObj: [
      //     {
      //       field: "name",
      //       type: "string",
      //       required: true,
      //     },
      //   ],
      // }}
    />
  );
}

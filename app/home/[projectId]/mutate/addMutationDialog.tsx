import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import MutationDialog, { Mutation } from "./mutationDialog";
import { useMutation } from "@/app/hooks/customMutation";
import { createMutation } from "@/routes/mutation-routes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";

export default function AddMutationDialog({
  projectId,
}: {
  projectId: string;
}) {
  const token = useUserToken();
  const queryClient = useQueryClient();
  const [closeModal, setCloseModal] = useState(false);
  const mutation = useMutation({
    mutationFn: createMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/mutate`],
      });
      setCloseModal(true);
      toast.success("Mutation created successfully");
    },
  });
  const handleAddMutationFn = async (data: Mutation) => {
    mutation.mutate({ projectId, data, token });
  };
  return (
    <MutationDialog
      type="add"
      activateBtn={<Button>Add Mutation</Button>}
      onSubmit={handleAddMutationFn}
      closeModal={closeModal}
      isLoading={mutation.isPending}
    />
  );
}

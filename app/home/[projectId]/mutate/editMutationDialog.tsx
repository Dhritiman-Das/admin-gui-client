import { Button } from "@/components/ui/button";
import React from "react";
import MutationDialog, { Mutation } from "./mutationDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDbDetails } from "@/routes/project-routes";
import { useUserToken } from "@/app/hooks/useUserToken";
import { getAMutation, updateMutation } from "@/routes/mutation-routes";
import { useMutation } from "@/app/hooks/customMutation";
import { toast } from "sonner";

export default function EditMutationDialog({
  projectId,
  mutationId,
  activateBtn,
}: {
  projectId: string;
  mutationId: string;
  activateBtn: React.ReactNode;
}) {
  const jwtToken = useUserToken();
  const queryClient = useQueryClient();
  const [closeModal, setCloseModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const fetchDbDetails = useQuery({
    queryKey: [`${projectId}/project/db-details`],
    queryFn: () =>
      getDbDetails({ projectId: projectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!projectId,
  });
  const {
    isPending,
    error,
    isSuccess,
    data: mutationData,
  } = useQuery({
    queryKey: [`${projectId}/mutate/${mutationId}`],
    queryFn: () =>
      getAMutation({
        mutationId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!mutationId,
  });
  console.log({
    isPending,
    error,
    isSuccess,
    data: mutationData,
  });

  const editMutation = useMutation({
    mutationFn: updateMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/mutate/${mutationId}`],
      });
      setCloseModal(true);
      toast.success("Mutation updated successfully");
    },
  });

  const handleEditMutationFn = (data: Mutation) => {
    setLoading(true);
    console.log(data);
    editMutation.mutate({ mutationId, data, token: jwtToken as string });
    setLoading(false);
  };
  return (
    <MutationDialog
      type="edit"
      activateBtn={activateBtn}
      onSubmit={handleEditMutationFn}
      initialData={mutationData?.data as Mutation}
      closeModal={closeModal}
      isLoading={loading}
    />
  );
}

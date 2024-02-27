import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/routes/project-routes";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useMutation } from "@/app/hooks/customMutation";

export default function RemoveMemberDialog({
  projectId,
  userId,
  email,
  activateBtn,
}: {
  projectId: string;
  userId: string;
  email: string;
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const removeMemberMutation = useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/members`],
      });
      setDialogOpen(false);
      toast.success("User removed");
    },
  });

  const removeUser = async () => {
    await removeMemberMutation.mutateAsync({
      projectId,
      userId,
      token: jwtToken as string,
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{activateBtn}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove member</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you remove the user {email}?
        </DialogDescription>
        <DialogFooter>
          <Button
            type="submit"
            variant={"destructive"}
            loading={removeMemberMutation.isPending}
            onClick={removeUser}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

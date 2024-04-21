import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { deleteQuery } from "@/routes/project-routes";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useRouter } from "next/navigation";
import { useMutation } from "@/app/hooks/customMutation";
import { deleteMutation } from "@/routes/mutation-routes";

export const DeleteMutationFormSchema = z.object({
  confirmText: z.string().refine((value) => value === "delete", {
    message: 'Confirmation message must be "delete"',
  }),
});
export default function DeleteMutationDialog({
  projectId,
  mutationId,
  activateBtn,
}: {
  projectId: string;
  mutationId: string;
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const jwtToken = useUserToken();
  const form = useForm<z.infer<typeof DeleteMutationFormSchema>>({
    resolver: zodResolver(DeleteMutationFormSchema),
    defaultValues: {
      confirmText: "",
    },
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const deleteMutationMutation = useMutation({
    mutationFn: deleteMutation,
    onSuccess: () => {
      router.push(`/home/${projectId}/mutate`);
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/mutate`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/mutate/${mutationId}`],
      });
      setDialogOpen(false);
      toast.success("Mutation deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async () => {
    await deleteMutationMutation.mutateAsync({
      mutationId,
      token: jwtToken as string,
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{activateBtn}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete query</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="confirmText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <p>
                      To delete this mutation, type <strong>delete</strong> to
                      confirm. This cannot be undone.
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirmation message"
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                variant={"destructive"}
                loading={deleteMutationMutation.isPending}
              >
                Delete
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

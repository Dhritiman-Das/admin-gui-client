import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuery } from "@/routes/project-routes";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useRouter } from "next/navigation";

export const DeleteQueryFormSchema = z.object({
  confirmText: z.string().refine((value) => value === "delete", {
    message: 'Confirmation message must be "delete"',
  }),
});
export default function DeleteQueryDialog({
  projectId,
  queryId,
  activateBtn,
}: {
  projectId: string;
  queryId: string;
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const jwtToken = useUserToken();
  const form = useForm<z.infer<typeof DeleteQueryFormSchema>>({
    resolver: zodResolver(DeleteQueryFormSchema),
    defaultValues: {
      confirmText: "",
    },
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const deleteQueryMutation = useMutation({
    mutationFn: deleteQuery,
    onSuccess: () => {
      router.push(`/home/${projectId}/query`);
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/query`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/query/${queryId}`],
      });
      setDialogOpen(false);
      toast.success("Query deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async () => {
    await deleteQueryMutation.mutateAsync({
      projectId,
      queryId,
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
                      To delete this query, type <strong>delete</strong> to
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
                loading={deleteQueryMutation.isPending}
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

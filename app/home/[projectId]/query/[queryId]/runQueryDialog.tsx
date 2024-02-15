import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { executeQuery, getQuery } from "@/routes/project-routes";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useEffect, useState } from "react";
import { extractVariables } from "@/server/lib/helpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BadgedQueries from "@/components/ui/badged-queries";

export function RunQueryDialog({
  projectId,
  queryId,
  activateBtn,
}: {
  projectId: string;
  queryId: string;
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const {
    isPending,
    error,
    isSuccess,
    data: queryData,
  } = useQuery({
    queryKey: [`${projectId}/query/${queryId}`],
    queryFn: () =>
      getQuery({
        projectId: projectId,
        queryId: queryId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!queryId,
  });
  const executeQueryMutation = useMutation({
    mutationFn: executeQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/history`],
      });
      toast.success("Query executed successfully");
    },
  });
  const [queryState, setQueryState] = useState<any[]>([]);
  useEffect(() => {
    if (queryData?.status === 200 && queryData?.data) {
      console.log(extractVariables(queryData.data.queryString));

      setQueryState(extractVariables(queryData.data.queryString));
    }
  }, [queryData]);
  const FormSchema = z.object(
    queryState.reduce((prev, curr) => {
      return { ...prev, [curr.variable]: z.string() };
    }, {})
  );
  const defaultValues = queryState.reduce((prev, curr) => {
    return { ...prev, [curr.variable]: "" };
  }, {});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    executeQueryMutation.mutate({
      projectId,
      queryId,
      token: jwtToken as string,
      executeQueryDto: data,
    });
  }
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{activateBtn}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Run</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Run query</DialogTitle>
          <div className="mt-2">
            {isPending ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <BadgedQueries inputString={queryData?.data.queryString} />
            )}
          </div>
        </DialogHeader>
        {isPending ? (
          "Loading..."
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {queryState.map((field, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={field.variable}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{field.name}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter ${field.name}`}
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <DialogFooter>
                <Button type="submit" loading={executeQueryMutation.isPending}>
                  Run
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { executeQuery, getQuery } from "@/routes/project-routes";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useEffect, useState } from "react";
import { extractVariables } from "@/lib/helpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BadgedQueries from "@/components/ui/badged-queries";
import { useMutation } from "@/app/hooks/customMutation";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export function RunQueryDialog({
  projectId,
  queryId,
  activateBtn,
}: {
  projectId: string;
  queryId: string;
  activateBtn: React.ReactNode;
}) {
  const { theme, resolvedTheme } = useTheme();
  const monaco = useMonaco();
  const [dateTime, setDateTime] = useState<{
    date: Date | null;
    hasTime: boolean;
  }>({ date: null, hasTime: true });

  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const [openJsonViewer, setOpenJsonViewer] = useState(false);
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
      setOpenJsonViewer(true);
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
      {!!!openJsonViewer && (
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {queryState.map((field, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={field.variable}
                    render={({ field }) => {
                      console.log({ field, queryData });

                      const fieldType = queryData?.data?.queryDataTypes
                        ? queryData?.data?.queryDataTypes[field.name]
                        : "string";
                      const inputType =
                        fieldType === "number"
                          ? "number"
                          : fieldType === "date"
                          ? "datetime-local"
                          : "text";
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>{field.name}</FormLabel>
                          <FormControl>
                            {inputType === "datetime-local" ? (
                              <DateTimePicker
                                value={dateTime}
                                onChange={(e) => {
                                  setDateTime((prevState) => ({
                                    ...prevState,
                                    date: e.date,
                                  }));
                                  field.onChange(e.date.toISOString());
                                }}
                              />
                            ) : (
                              <Input
                                placeholder={`Enter ${field.name} (${inputType})`}
                                {...field}
                                value={field.value || ""}
                                onChange={field.onChange}
                                type={inputType}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <DialogFooter>
                  <Button
                    type="submit"
                    loading={executeQueryMutation.isPending}
                  >
                    Run
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      )}
      {openJsonViewer && (
        <DialogContent
          className={"lg:max-w-screen-lg overflow-y-auto max-h-screen"}
        >
          <DialogHeader>
            <DialogTitle>Run query</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-codeEditor py-3 border-solid border-2 border-muted rounded-[--radius]">
              <Editor
                defaultValue={JSON.stringify(
                  executeQueryMutation?.data?.data,
                  null,
                  2
                )}
                height={"70vh"}
                defaultLanguage="json"
                theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                options={{ readOnly: true }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => {
                setOpenJsonViewer(false);
              }}
            >
              Back
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              loading={executeQueryMutation.isPending}
            >
              Run again
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

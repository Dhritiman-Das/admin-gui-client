import { useMutation } from "@/app/hooks/customMutation";
import { useUserToken } from "@/app/hooks/useUserToken";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { executeMutationQuery, getAMutation } from "@/routes/mutation-routes";
import { extractVariables } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function MutationQueryForm({
  projectId,
  mutationId,
  onSuccessStateChange,
  setQueryResult,
  setQueryRecord,
}: {
  projectId: string;
  mutationId: string;
  onSuccessStateChange: () => void;
  setQueryResult: Dispatch<SetStateAction<any>>;
  setQueryRecord: Dispatch<SetStateAction<any>>;
}) {
  const queryClient = useQueryClient();
  const token = useUserToken();
  const {
    isPending,
    error,
    isSuccess,
    data: queryData,
  } = useQuery({
    queryKey: [`${projectId}/mutate/${mutationId}`],
    queryFn: () =>
      getAMutation({
        mutationId,
        token,
      }),
    enabled: !!token && !!mutationId,
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

  const [dateTime, setDateTime] = useState<{
    date: Date | null;
    hasTime: boolean;
  }>({ date: null, hasTime: true });

  const executeQueryMutation = useMutation({
    mutationFn: executeMutationQuery,
    onSuccess: ({ data }) => {
      onSuccessStateChange();
      setQueryResult(data);
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/history`],
      });
      toast.success("Query executed successfully");
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setQueryRecord(data);
    executeQueryMutation.mutate({
      mutationId,
      token,
      body: data,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
          <Button type="submit" loading={executeQueryMutation.isPending}>
            Run
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

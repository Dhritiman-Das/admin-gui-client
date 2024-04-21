import { useUserToken } from "@/app/hooks/useUserToken";
import { Skeleton } from "@/components/ui/skeleton";
import { executeMutationChange, getAMutation } from "@/routes/mutation-routes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Mutation } from "../columns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/app/hooks/customMutation";
import { toast } from "sonner";

const RunMutationFormSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.date()])
);

export default function MutationInputForm({
  projectId,
  mutationId,
  onGoBack,
  queryRecord,
  onSuccess,
}: {
  projectId: string;
  mutationId: string;
  onGoBack: () => void;
  queryRecord: any;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const token = useUserToken();
  const [mutationObjs, setMutationObjs] = React.useState<Mutation["mutateObj"]>(
    []
  );
  const [mutationFields, setMutationFields] =
    React.useState<Record<string, string>>();

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

  const runMutation = useMutation({
    mutationFn: executeMutationChange,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/history`],
      });
      onSuccess();
      toast.success("Mutation executed successfully");
    },
  });

  const form = useForm<z.infer<typeof RunMutationFormSchema>>({
    resolver: zodResolver(RunMutationFormSchema),
  });

  useEffect(() => {
    if (queryData?.status === 200 && queryData?.data) {
      setMutationObjs(queryData.data.mutateObj);
    }
  }, [queryData]);

  useEffect(() => {
    //Convert the mutationObjs to Record<string, 'string' || 'number' || 'date' || 'boolean'>
    //The key will be the field name
    const obj = mutationObjs?.reduce((prev, curr) => {
      return { ...prev, [curr.field]: "" };
    }, {});
    console.log({ obj });
    setMutationFields(obj);
  }, [mutationObjs]);

  const [dateTime, setDateTime] = useState<{
    date: Date | null;
    hasTime: boolean;
  }>({ date: null, hasTime: true });

  const onSubmit = async (data: z.infer<typeof RunMutationFormSchema>) => {
    const body = {
      queryDto: queryRecord,
      mutationDto: data,
    };
    console.log({ body });
    runMutation.mutate({
      mutationId,
      token,
      body,
    });
  };

  if (isPending) {
    return <Skeleton className="h-[40px] w-full" />;
  }
  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        {mutationFields &&
          Object.entries(mutationFields).map(([field, type], index) => {
            return (
              <FormField
                key={index}
                control={form.control}
                name={field} // Use the actual field name
                render={({ field }) => {
                  const fieldType = type || "string";
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
                            value={
                              typeof field.value === "boolean" ||
                              field.value instanceof Date
                                ? String(field.value)
                                : field.value
                            }
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
            );
          })}
        <DialogFooter>
          <Button type="button" variant={"ghost"} onClick={() => onGoBack()}>
            Back
          </Button>

          <Button type="submit" loading={runMutation.isPending}>
            Run
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function SingleDetail({
  header,
  value,
  loading,
}: {
  header: string;
  value: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6">{header}</dt>
        <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
          {loading ? <Skeleton className="h-[20px] w-[150px]" /> : value}
        </dd>
      </div>
      <Separator />
    </>
  );
}

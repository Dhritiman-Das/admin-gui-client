import {
  Dialog,
  DialogContent,
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
import React from "react";
import MutationQueryForm from "./MutationQueryForm";
import MutationView from "./mutationView";
import MutationInputForm from "./mutationInputForm";

export default function RunMutationDialog({
  projectId,
  mutationId,
  activateBtn,
}: {
  projectId: string;
  mutationId: string;
  activateBtn: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [currentState, setCurrentState] = React.useState<
    "queryInput" | "queryResult" | "mutationInput"
  >("queryInput");
  const [queryResult, setQueryResult] = React.useState<any>(null);
  const [queryRecord, setQueryRecord] = React.useState<any>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle>Run mutation</DialogTitle>
          <div className="mt-2"></div>
          {currentState === "queryInput" && (
            <MutationQueryForm
              mutationId={mutationId}
              projectId={projectId}
              onSuccessStateChange={() => setCurrentState("queryResult")}
              setQueryResult={setQueryResult}
              setQueryRecord={setQueryRecord}
            />
          )}
          {currentState === "queryResult" && (
            <MutationView
              mutationId={mutationId}
              projectId={projectId}
              queryResult={queryResult}
              onSuccessStateChange={() => setCurrentState("mutationInput")}
              onGoBack={() => setCurrentState("queryInput")}
              setQueryResult={setQueryResult}
            />
          )}
          {currentState === "mutationInput" && (
            <MutationInputForm
              mutationId={mutationId}
              projectId={projectId}
              onGoBack={() => setCurrentState("queryInput")}
              queryRecord={queryRecord}
              onSuccess={() => setOpen(false)}
            />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

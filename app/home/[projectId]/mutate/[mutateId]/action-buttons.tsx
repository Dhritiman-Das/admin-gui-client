import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Heart, Pencil, Play, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RunMutationDialog from "./runMutationDialog";
import EditMutationDialog from "../editMutationDialog";
import DeleteMutationDialog from "../deleteMutationDialog";

interface SingleButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface SingleButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const SingleButton = React.forwardRef<
  HTMLButtonElement,
  SingleButtonProps
>(({ icon, label, onClick }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="icon" onClick={onClick} ref={ref}>
            {icon}
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

SingleButton.displayName = "SingleButton";

export default function ActionButtons({
  projectId,
  mutationId,
}: {
  projectId: string;
  mutationId: string;
}) {
  const handleFavouriteClick = () => {
    console.log("Favourite button clicked");
  };

  const handleDeleteClick = () => {
    console.log("Delete button clicked");
  };

  return (
    <div className="action-icons">
      <RunMutationDialog
        projectId={projectId}
        mutationId={mutationId}
        activateBtn={
          <SingleButton icon={<Play className="h-8 w-8" />} label="Run" />
        }
      />

      <EditMutationDialog
        projectId={projectId}
        mutationId={mutationId}
        activateBtn={
          <SingleButton icon={<Pencil className="h-8 w-8" />} label="Edit" />
        }
      />

      <SingleButton
        icon={<Heart className="h-8 w-8" />}
        label="Favourite"
        onClick={handleFavouriteClick}
      />

      <DeleteMutationDialog
        projectId={projectId}
        mutationId={mutationId}
        activateBtn={
          <SingleButton
            icon={<Trash className="h-8 w-8 text-destructive" />}
            label="Delete"
            onClick={handleDeleteClick}
          />
        }
      />

      {/* <EditQueryDialog
        projectId={projectId}
        queryId={queryId}
        activateBtn={
          <SingleButton icon={<Pencil className="h-8 w-8" />} label="Edit" />
        }
      />

      <DuplicateQueryDialog
        projectId={projectId}
        queryId={queryId}
        activateBtn={
          <SingleButton icon={<Copy className="h-8 w-8" />} label="Duplicate" />
        }
      />
    
      <DeleteQueryDialog
        projectId={projectId}
        queryId={queryId}
        activateBtn={
          <SingleButton
            icon={<Trash className="h-8 w-8 text-destructive" />}
            label="Delete"
            onClick={handleDeleteClick}
          />
        }
      /> */}
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Heart, Pencil, Play, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RunQueryDialog } from "./runQueryDialog";
import EditQueryDialog from "../editQueryDialog";
import DuplicateQueryDialog from "../duplicateQueryDialog";
import DeleteQueryDialog from "../deleteQueryDialog";

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
  queryId,
}: {
  projectId: string;
  queryId: string;
}) {
  const handleFavouriteClick = () => {
    console.log("Favourite button clicked");
  };

  const handleDeleteClick = () => {
    console.log("Delete button clicked");
  };

  return (
    <div className="action-icons">
      <RunQueryDialog
        projectId={projectId}
        queryId={queryId}
        activateBtn={
          <SingleButton icon={<Play className="h-8 w-8" />} label="Run" />
        }
      />

      <EditQueryDialog
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
      <SingleButton
        icon={<Heart className="h-8 w-8" />}
        label="Favourite"
        onClick={handleFavouriteClick}
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
      />
    </div>
  );
}

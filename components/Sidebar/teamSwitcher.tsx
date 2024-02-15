"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Check, PlusCircle, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/routes/user-routes";
import { MySession } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

type Project = {
  name: string;
  _id: string;
  mode: "personal" | "teams";
};

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(
    null
  );
  const jwtToken = (session as MySession)?.userToken;
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  useEffect(() => {
    console.log(
      "projectId from locastorage ",
      localStorage.getItem("projectId")
    );

    setCurrentProjectId(localStorage.getItem("projectId"));
  }, []);
  const {
    isPending,
    error,
    data: response,
  } = useQuery({
    queryKey: ["user/me"],
    queryFn: () => getUserInfo(jwtToken as string),
    enabled: !!jwtToken,
  });
  useEffect(() => {
    if (response?.status === 200) {
      setProjects(response.data.projects);
    }
  }, [response]);
  useEffect(() => {
    console.log(
      { projects },
      projects.find((project) => project._id === currentProjectId)
    );
  }, [projects]);
  if (error) {
    <div className="">Error</div>;
  }
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-full justify-between", className)}
          >
            {isPending ? (
              <Skeleton className="h-[10px] w-[150px]" />
            ) : (
              <div className="truncate">
                {projects.find((project) => project._id === currentProjectId)
                  ?.name || "no name"}
              </div>
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {projects.map((project, index) => (
                <CommandGroup key={project._id + index} heading={project.name}>
                  {projects.map((project) => (
                    <CommandItem
                      key={project._id}
                      onSelect={() => {
                        setCurrentProjectId(project._id);
                        setOpen(false);
                        router.refresh();
                      }}
                      className="text-sm"
                    >
                      {project.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentProjectId === project._id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Mongo URI</Label>
              <Input
                id="mongoUri"
                placeholder="mongodb://<username>:<password>@<host>:<port>/<database>"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

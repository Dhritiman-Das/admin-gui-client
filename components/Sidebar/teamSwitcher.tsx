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
import { useSession } from "next-auth/react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useUserToken } from "@/app/hooks/useUserToken";
import CreateProjectForm from "@/app/create-project/create-project-form";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

// type Project = {
//     name: string;
//     _id: string;
//     mode: "personal" | "teams";
// };

type Project = {
  project: {
    _id: string;
    mode: "personal" | "team";
    name: string;
    dbConnectionString: string;
  };
  role: string;
  isAdvancedSettings: boolean;
  advancedSettings: {
    query: string;
    mutate: string;
    members: string;
    projects: string;
  };
};
type ProjectGroups = {
  personal?: Project[];
  team?: Project[];
};

function replaceProjectIdInUrl(
  relativeUrl: string,
  newProjectId: string
): string {
  const urlParts = relativeUrl.split("/");

  // Replace the projectId in the path
  if (urlParts[2]) {
    urlParts[2] = newProjectId;
  }

  return urlParts.join("/");
}
export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(
    null
  );
  const jwtToken = useUserToken();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [projectObject, setProjectObject] = React.useState<ProjectGroups>({
    team: [],
    personal: [],
  });
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  useEffect(() => {
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
      const projectsArray: Project[] = response.data.projects;
      const projectsObject = projectsArray.reduce(
        (acc: ProjectGroups, curr) => {
          const projectType = curr.project.mode;
          if (!acc[projectType]) {
            acc[projectType] = [];
          }
          acc[projectType]!.push(curr);
          return acc;
        },
        {}
      );
      console.log({ projectsObject });

      setProjectObject(projectsObject);
      setProjects(projectsArray);
    }
  }, [response]);
  useEffect(() => {
    console.log(
      { projects },
      projects.find((projectObj) => projectObj.project._id === currentProjectId)
    );
  }, [projects]);
  function switchToNewProject(projectId: string) {
    setCurrentProjectId(projectId);
    localStorage.setItem("projectId", projectId);
    setOpen(false);
    const url = `${pathName}?${searchParams}`;
    const newUrl = replaceProjectIdInUrl(url, projectId);
    router.replace(newUrl);
  }

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
                {projects.find(
                  (projectObj) => projectObj.project._id === currentProjectId
                )?.project.name || "no name"}
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
              <CommandGroup heading="Personal">
                {projectObject.personal?.map((project) => (
                  <CommandItem
                    key={"Project" + project.project._id}
                    onSelect={() => {
                      switchToNewProject(project.project._id);
                    }}
                    className="text-sm"
                  >
                    {project.project.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentProjectId === project.project._id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Teams">
                {projectObject.team?.map((project) => (
                  <CommandItem
                    key={"Project" + project.project._id}
                    onSelect={() => {
                      switchToNewProject(project.project._id);
                    }}
                    className="text-sm"
                  >
                    {project.project.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentProjectId === project.project._id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* {projects.map((project, index) => (
                <CommandGroup
                  key={project.project._id + index}
                  heading={project.project.name}
                >
                  {projects.map((project) => (
                    <CommandItem
                      key={"Project" + project.project._id}
                      onSelect={() => {
                        setCurrentProjectId(project.project._id);
                        setOpen(false);
                        router.refresh();
                      }}
                      className="text-sm"
                    >
                      {project.project.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentProjectId === project.project._id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))} */}
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
                    Create Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Add a new project to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm closeDialog={() => setShowNewTeamDialog(false)} />
      </DialogContent>
    </Dialog>
  );
}

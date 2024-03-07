import { Profile } from "@/app/home/[projectId]/query/columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getLocalTime } from "@/server/lib/helpers";
import { CalendarDays, Clock, Mail } from "lucide-react";

export function ProfileHoverCard({ profile }: { profile: Profile }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <Avatar>
            <AvatarImage src={profile?.image || ""} />
            <AvatarFallback>
              {profile?.name?.slice(0, 2) || "DD"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.image || ""} />
            <AvatarFallback>{profile?.name.slice(0, 2) || "DD"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{profile?.name}</h4>
            <p className="text-sm">{profile?.title}</p>
            <div className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {profile?.email}
              </span>
            </div>
            <div className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {getLocalTime(profile?.timeZone)}
              </span>
            </div>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

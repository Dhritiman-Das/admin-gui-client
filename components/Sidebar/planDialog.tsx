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
import { Flame } from "lucide-react";

export function PlanDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <Flame /> Free plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Free Plan</DialogTitle>
          <DialogDescription>
            As one of our first customers, we are offering you a free plan. We
            appreciate your early support for our app. As a token of our
            gratitude, you will also receive a special discount on future
            upgrades. Enjoy!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";

export function WatchVideo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-0" variant={"link"}>
          Watch demo <Play size={18} className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="py-10">
        <div
          style={{
            position: "relative",
            paddingBottom: "64.94708994708994%",
            height: 0,
          }}
        >
          <iframe
            src="https://www.loom.com/embed/88ebcbdfbc194ee89b76541a651f010a?sid=1022cd8d-4b38-4dcd-93b9-77d14d351db8&hide_view_count=true"
            frameBorder="0"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}

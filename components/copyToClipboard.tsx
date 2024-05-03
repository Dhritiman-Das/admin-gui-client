import React from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyToClipboardProps {
  value: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ value }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Copied to clipboard");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
      <Copy className="h-4 w-4" />
    </Button>
  );
};

export default CopyToClipboard;

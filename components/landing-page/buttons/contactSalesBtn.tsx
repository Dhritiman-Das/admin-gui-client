import { Button } from "@/components/ui/button";
import React from "react";

export default function ContactSalesBtn() {
  const handleClick = () => {
    window.location.href = "mailto:iamdhritiman01@gmail.com";
  };

  return (
    <Button variant={"outline"} onClick={handleClick}>
      Contact Sales
    </Button>
  );
}

import React from "react";
import { Badge } from "./badge";

export default function BadgedQueries({
  inputString,
}: {
  inputString: string;
}) {
  // Regular expression to find 'var(value)' in the string
  const regex = /var\(([^)]+)\)/g;

  // Split the string into parts
  const parts = inputString.split(regex);

  // Map over the parts and replace 'var(value)' with <Badge>{value}</Badge>
  const elements = parts.map((part, index) => {
    if (index % 2 === 1) {
      // If the index is odd, this part is a 'value' from 'var(value)'
      return (
        <Badge variant={"outline"} key={index}>
          {part}
        </Badge>
      );
    } else {
      // If the index is even, this part is a regular string
      return part;
    }
  });

  // Return the elements as a single React element
  return <>{elements}</>;
}

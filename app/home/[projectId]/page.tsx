"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const parentPath = usePathname();
  useEffect(() => {
    router.replace(parentPath + "/query");
  }, [router]);

  return <div>page</div>;
}

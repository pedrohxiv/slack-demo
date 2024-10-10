"use client";

import { useEffect, useState } from "react";

import { CreateWorkspace } from "@/components/modals/create-workspace";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateWorkspace />
    </>
  );
};

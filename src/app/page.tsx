"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { getWorkspaces } from "@/actions/workspaces";
import { useCreateWorkspace } from "@/store/create-workspace";

const RootPage = () => {
  const [open, setOpen] = useCreateWorkspace();

  const router = useRouter();

  const { data, isLoading } = getWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [open, setOpen, isLoading, router, workspaceId]);

  return null;
};

export default RootPage;

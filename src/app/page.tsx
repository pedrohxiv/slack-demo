"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getWorkspaces } from "@/actions/workspaces";
import { useCreateWorkspace } from "@/store/create-workspace";

const RootPage = () => {
  const [open, setOpen] = useCreateWorkspace();

  const router = useRouter();

  const { data } = getWorkspaces();

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data[0]) {
      router.replace(`/workspace/${data[0]._id}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [open, setOpen, router, data]);

  return null;
};

export default RootPage;

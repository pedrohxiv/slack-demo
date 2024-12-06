"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { getChannels } from "@/actions/channels";
import { getCurrentMember } from "@/actions/members";
import { getWorkspace } from "@/actions/workspaces";
import { useCreateChannel } from "@/store/create-channel";

const WorkspacePage = () => {
  const [open, setOpen] = useCreateChannel();

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { data: currentMember } = getCurrentMember({
    workspaceId: params.workspaceId,
  });
  const { data: workspace } = getWorkspace({
    id: params.workspaceId,
  });
  const { data: channels } = getChannels({
    workspaceId: params.workspaceId,
  });

  useEffect(() => {
    if (!currentMember || !workspace || !channels) {
      return;
    }

    if (channels[0]) {
      router.push(
        `/workspace/${params.workspaceId}/channel/${channels[0]._id}`
      );
    } else if (!open && currentMember.role === "admin") {
      setOpen(true);
    }
  }, [
    currentMember,
    workspace,
    channels,
    open,
    setOpen,
    router,
    params.workspaceId,
  ]);

  return null;
};

export default WorkspacePage;

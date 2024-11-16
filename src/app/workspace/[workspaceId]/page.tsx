"use client";

import { TriangleAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { getChannels } from "@/actions/channels";
import { getCurrentMember } from "@/actions/members";
import { getWorkspace } from "@/actions/workspaces";
import { useCreateChannel } from "@/store/create-channel";

const WorkspacePage = () => {
  const [open, setOpen] = useCreateChannel();

  const router = useRouter();
  const params = useParams<{ workspaceId: string }>();

  const { data: memberData, isLoading: memberIsLoading } = getCurrentMember({
    workspaceId: params.workspaceId,
  });
  const { data: workspaceData, isLoading: workspaceIsLoading } = getWorkspace({
    id: params.workspaceId,
  });
  const { data: channelsData, isLoading: channelsIsLoading } = getChannels({
    workspaceId: params.workspaceId,
  });

  const channelId = useMemo(() => channelsData?.[0]._id, [channelsData]);
  const isAdmin = useMemo(() => memberData?.role === "admin", [memberData]);

  useEffect(() => {
    if (
      workspaceIsLoading ||
      channelsIsLoading ||
      memberIsLoading ||
      !memberData ||
      !workspaceData
    ) {
      return;
    }

    if (channelId) {
      router.push(`/workspace/${params.workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    isAdmin,
    memberIsLoading,
    workspaceIsLoading,
    channelsIsLoading,
    memberData,
    workspaceData,
    open,
    setOpen,
    router,
    params.workspaceId,
  ]);

  if (memberIsLoading || workspaceIsLoading || channelsIsLoading) {
    return null;
  }

  if (!memberData || !workspaceData) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found!
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Channel not found!</span>
    </div>
  );
};

export default WorkspacePage;

"use client";

import { TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";

import { getChannel } from "@/actions/channels";

import { ChatInput } from "./_components/chat-input";
import { Header } from "./_components/header";

const ChannelPage = () => {
  const params = useParams<{ workspaceId: string; channelId: string }>();

  const { data, isLoading } = getChannel({ id: params.channelId });

  if (isLoading) {
    return null;
  }

  if (!data) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Channel not found!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={data.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message # ${data.name}`} />
    </div>
  );
};

export default ChannelPage;

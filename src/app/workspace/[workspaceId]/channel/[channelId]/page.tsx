"use client";

import { TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";

import { getChannel } from "@/actions/channels";
import { getMessages } from "@/actions/messages";

import { ChatInput } from "./_components/chat-input";
import { Header } from "./_components/header";
import { MessageList } from "./_components/message-list";

const ChannelPage = () => {
  const params = useParams<{ workspaceId: string; channelId: string }>();

  const { data, isLoading } = getChannel({ id: params.channelId });
  const { results, status, loadMore } = getMessages({
    channelId: params.channelId,
  });

  if (isLoading || status === "LoadingFirstPage") {
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
      <MessageList
        channelName={data.name}
        channelCreationTime={data._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${data.name}`} />
    </div>
  );
};

export default ChannelPage;

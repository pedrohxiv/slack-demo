"use client";

import { useParams } from "next/navigation";

import { getChannel } from "@/actions/channels";
import { getMessages } from "@/actions/messages";
import { MessageList } from "@/components/message-list";

import { ChatInput } from "./_components/chat-input";
import { Header } from "./_components/header";

const ChannelPage = () => {
  const params = useParams<{ workspaceId: string; channelId: string }>();

  const { data } = getChannel({ id: params.channelId });
  const { results, status, loadMore } = getMessages({
    channelId: params.channelId,
  });

  if (!data || status === "LoadingFirstPage") {
    return null;
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

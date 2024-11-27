import { useParams } from "next/navigation";

import { getMember } from "@/actions/members";
import { getMessages } from "@/actions/messages";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";

import { ChatInput } from "./chat-input";
import { Header } from "./header";

interface Props {
  id: string;
}

export const Conversation = ({ id }: Props) => {
  const params = useParams<{ workspaceId: string; memberId: string }>();

  const { data: memberData, isLoading: memberIsLoading } = getMember({
    id: params.memberId,
  });
  const { results, status, loadMore } = getMessages({
    conversationId: id,
  });
  const { onOpenProfile } = usePanel();

  if (!memberData || memberIsLoading || status === "LoadingFirstPage") {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={memberData.user.name}
        memberImage={memberData.user.image}
        onClick={() => onOpenProfile(params.memberId)}
      />
      <MessageList
        memberName={memberData.user.name}
        memberImage={memberData.user.image}
        variant="conversation"
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${memberData.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

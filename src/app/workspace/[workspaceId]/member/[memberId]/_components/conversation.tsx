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

  const { data: member } = getMember({ id: params.memberId });
  const { results, status, loadMore } = getMessages({ conversationId: id });
  const { onOpenProfile } = usePanel();

  if (!member || status === "LoadingFirstPage") {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member.user.name}
        memberImage={member.user.image}
        onClick={() => onOpenProfile(params.memberId)}
      />
      <MessageList
        memberName={member.user.name}
        memberImage={member.user.image}
        variant="conversation"
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

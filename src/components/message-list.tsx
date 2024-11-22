import { differenceInMinutes, format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { getCurrentMember } from "@/actions/members";
import { GetMessagesReturnType } from "@/actions/messages";
import { Message } from "@/components/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateLabel } from "@/lib/utils";

interface Props {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const params = useParams<{ workspaceId: string; channelId: string }>();

  const { data: memberData } = getCurrentMember({
    workspaceId: params.workspaceId,
  });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);

      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];

            const isCompact =
              prevMessage &&
              prevMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < 5;

            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === memberData?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
                threadName={message.threadName}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(element) => {
          if (element) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(element);

            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader2 className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <div className="mt-[88px] mx-5 mb-4">
          <p className="text-2xl font-bold flex items-center mb-2">
            # {channelName}
          </p>
          <p className="font-normal text-slate-900 mb-4">
            This channel was created on{" "}
            {format(channelCreationTime, "MMMM do, yyyy")}. This is the very
            beginning of the <strong>{channelName}</strong> channel.
          </p>
        </div>
      )}
      {variant === "conversation" && (
        <div className="mt-[88px] mx-5 mb-4">
          <div className="flex items-center gap-x-1 mb-2">
            <Avatar className="size-14 mr-2">
              <AvatarImage src={memberImage} />
              <AvatarFallback className="text-3xl">
                {memberName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-2xl font-bold">{memberName}</p>
          </div>
          <p className="font-normal text-slate-900 mb-4">
            This conversation is just between you and{" "}
            <strong>{memberName}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

import { differenceInMinutes, format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useParams } from "next/navigation";
import Quill from "quill";
import { useRef, useState } from "react";

import { getCurrentMember } from "@/actions/members";
import { createMessage, getMessage, getMessages } from "@/actions/messages";
import { generateUploadUrl } from "@/actions/upload";
import { Editor } from "@/components/editor";
import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDateLabel } from "@/lib/utils";

interface Props {
  messageId: string;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [editorKey, setEditorKey] = useState<number>(0);

  const params = useParams<{ workspaceId: string; channelId: string }>();
  const editorRef = useRef<Quill | null>(null);

  const { data: currentMember } = getCurrentMember({
    workspaceId: params.workspaceId,
  });
  const { data: message } = getMessage({ id: messageId });
  const { results, status, loadMore } = getMessages({
    channelId: params.channelId,
    parentMessageId: messageId,
  });
  const { mutate: generateUploadUrlMutate } = generateUploadUrl();
  const { mutate: createMessageMutate } = createMessage();
  const { toast } = useToast();

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);

      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values: {
        body: string;
        image?: string;
        workspaceId: string;
        channelId?: string;
        parentMessageId?: string;
      } = {
        body,
        image: undefined,
        workspaceId: params.workspaceId,
        channelId: params.channelId,
        parentMessageId: messageId,
      };

      if (image) {
        const url = await generateUploadUrlMutate({ throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessageMutate(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsPending(false);

      editorRef.current?.enable(true);
    }
  };

  if (!currentMember || !message || status === "LoadingFirstPage") {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between h-[49px] items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="sm" variant="ghost">
          <X className="size-5 stroke-[1.5]" />
        </Button>
      </div>
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
                  isAuthor={message.memberId === currentMember._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
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
                  if (entry.isIntersecting && status === "CanLoadMore") {
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
        {status === "LoadingMore" && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader2 className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          id={message._id}
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember._id}
          reactions={message.reactions}
          body={message.body}
          image={message.image}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply"
        />
      </div>
    </div>
  );
};

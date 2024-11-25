import { format } from "date-fns";

import { removeMessage, updateMessage } from "@/actions/messages";
import { toggleReaction } from "@/actions/reactions";
import { Editor } from "@/components/editor";
import { Hint } from "@/components/hint";
import { Reactions } from "@/components/reactions";
import { Renderer } from "@/components/renderer";
import { ThreadBar } from "@/components/thread-bar";
import { Thumbnail } from "@/components/thumbnail";
import { Toolbar } from "@/components/toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePanel } from "@/hooks/use-panel";
import { useToast } from "@/hooks/use-toast";
import { cn, formatFullTime } from "@/lib/utils";

interface Props {
  id: string;
  memberId: string;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: {
    _id: string;
    _creationTime: number;
    workspaceId: string;
    messageId: string;
    value: string;
    count: number;
    memberIds: string[];
  }[];
  body: string;
  image: string | null | undefined;
  updatedAt?: number;
  createdAt: number;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  updatedAt,
  createdAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: Props) => {
  const { mutate: updateMutate, isPending: updateIsPending } = updateMessage();
  const { mutate: removeMutate, isPending: removeIsPending } = removeMessage();
  const { mutate: toggleMutate, isPending: toggleIsPending } = toggleReaction();
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();
  const { toast } = useToast();

  const handleUpdate = ({ body }: { body: string }) => {
    updateMutate(
      { id, body },
      {
        onSuccess: () => {
          setEditingId(null);
        },
        onError: (error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        },
      }
    );
  };

  const handleRemove = () => {
    removeMutate(
      { id },
      {
        onSuccess: () => {
          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: (error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleMutate(
      { messageId: id, value },
      {
        onError: (error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        },
      }
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          {
            "bg-[#F2C74433] hover:bg-[#F2C74433]": isEditing,
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200":
              removeIsPending,
          }
        )}
      >
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                defaultValue={JSON.parse(body)}
                disabled={updateIsPending || removeIsPending || toggleIsPending}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={updateIsPending || removeIsPending || toggleIsPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        {
          "bg-[#F2C74433] hover:bg-[#F2C74433]": isEditing,
          "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200":
            removeIsPending,
        }
      )}
    >
      <div className="flex items-start gap-2">
        <button onClick={() => onOpenProfile(memberId)}>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback className="text-xl">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              defaultValue={JSON.parse(body)}
              disabled={updateIsPending || removeIsPending || toggleIsPending}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button
                className="font-bold text-primary hover:underline"
                onClick={() => onOpenProfile(memberId)}
              >
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-xs text-muted-foreground hover:underline">
                  {format(new Date(createdAt), "h:mm a")}
                </button>
              </Hint>
            </div>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
            <Reactions data={reactions} onChange={handleReaction} />
            <ThreadBar
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              name={threadName}
              onClick={() => onOpenMessage(id)}
            />
          </div>
        )}
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={updateIsPending || removeIsPending || toggleIsPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => onOpenMessage(id)}
          handleDelete={handleRemove}
          handleReaction={handleReaction}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};

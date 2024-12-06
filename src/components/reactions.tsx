import { SmilePlus } from "lucide-react";
import { useParams } from "next/navigation";

import { getCurrentMember } from "@/actions/members";
import { EmojiPopover } from "@/components/emoji-popover";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";

interface Props {
  data: {
    _id: string;
    _creationTime: number;
    workspaceId: string;
    messageId: string;
    value: string;
    count: number;
    memberIds: string[];
  }[];
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: Props) => {
  const params = useParams<{ workspaceId: string; channelId: string }>();

  const { data: currentMember } = getCurrentMember({
    workspaceId: params.workspaceId,
  });

  if (data.length === 0 || !currentMember) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              {
                "bg-blue-100/70 border-blue-500 text-white":
                  reaction.memberIds.includes(currentMember._id),
              }
            )}
            onClick={() => onChange(reaction.value)}
          >
            {reaction.value}
            <span
              className={cn("text-xs font-semibold text-muted-foreground", {
                "text-blue-500": reaction.memberIds.includes(currentMember._id),
              })}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
          <SmilePlus className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};

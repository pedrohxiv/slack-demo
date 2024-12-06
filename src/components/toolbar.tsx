import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";

import { EmojiPopover } from "@/components/emoji-popover";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface Props {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: Props) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji)}
        >
          <Button disabled={isPending} size="icon" variant="ghost">
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              disabled={isPending}
              onClick={handleThread}
              size="icon"
              variant="ghost"
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                disabled={isPending}
                onClick={handleEdit}
                size="icon"
                variant="ghost"
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button
                disabled={isPending}
                onClick={handleDelete}
                size="icon"
                variant="ghost"
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

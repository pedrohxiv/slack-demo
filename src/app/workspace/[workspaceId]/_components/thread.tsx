import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { getCurrentMember } from "@/actions/members";
import { getMessage } from "@/actions/messages";
import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";

interface Props {
  messageId: string;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const params = useParams<{ workspaceId: string }>();

  const { data: memberData, isLoading: memberIsLoading } = getCurrentMember({
    workspaceId: params.workspaceId,
  });
  const { data: messageData, isLoading: messageIsLoading } = getMessage({
    id: messageId,
  });

  if (!memberData || memberIsLoading || !messageData || messageIsLoading) {
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
      <div>
        <Message
          id={messageData._id}
          memberId={messageData.memberId}
          authorImage={messageData.user.image}
          authorName={messageData.user.name}
          isAuthor={messageData.memberId === memberData._id}
          reactions={messageData.reactions}
          body={messageData.body}
          image={messageData.image}
          updatedAt={messageData.updatedAt}
          createdAt={messageData._creationTime}
          isEditing={editingId === messageData._id}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
    </div>
  );
};

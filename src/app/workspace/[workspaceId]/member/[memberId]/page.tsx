"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { createOrGetConversation } from "@/actions/conversations";

import { Conversation } from "./_components/conversation";

const MemberPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const params = useParams<{ workspaceId: string; memberId: string }>();

  const { mutate, isPending } = createOrGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId: params.workspaceId, memberId: params.memberId },
      {
        onSuccess: (id) => {
          setConversationId(id);
        },
      }
    );
  }, [params.workspaceId, params.memberId, mutate]);

  if (isPending || !conversationId) {
    return null;
  }

  return <Conversation id={conversationId} />;
};

export default MemberPage;

import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"conversations"> | null) => void;
  onError?: (error: Error) => void;
};

type CreateOrGetConversationValues = { workspaceId: string; memberId: string };

export const createOrGetConversation = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.conversations.createOrGet);

  const mutate = useCallback(
    async (values: CreateOrGetConversationValues, options?: Options) => {
      try {
        setIsPending(true);

        const response = await mutation(values);

        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        options?.onError?.(error as Error);
      } finally {
        setIsPending(false);
      }
    },
    [mutation]
  );

  return { mutate, isPending };
};

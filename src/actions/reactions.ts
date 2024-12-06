import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"reactions"> | null) => void;
  onError?: (error: Error) => void;
};

type ToggleReactionValues = { messageId: string; value: string };

export const toggleReaction = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.reactions.toggle);

  const mutate = useCallback(
    async (values: ToggleReactionValues, options?: Options) => {
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

import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"messages"> | null) => void;
  onError?: (error: Error) => void;
  throwError?: boolean;
};

type CreateMessageValues = {
  body: string;
  image?: string;
  workspaceId: string;
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
};

export const createMessage = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.messages.create);

  const mutate = useCallback(
    async (values: CreateMessageValues, options?: Options) => {
      try {
        setIsPending(true);

        const response = await mutation(values);

        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setIsPending(false);
      }
    },
    [mutation]
  );

  return { mutate, isPending };
};

type GetMessagesProps = {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
};

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const getMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: GetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: 20 }
  );

  return { results, status, loadMore: () => loadMore(20) };
};

type GetMessageProps = { id: string };

export const getMessage = ({ id }: GetMessageProps) => {
  const data = useQuery(api.messages.getById, { id });

  return { data };
};

type UpdateMessageValues = { id: string; body: string };

export const updateMessage = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.messages.update);

  const mutate = useCallback(
    async (values: UpdateMessageValues, options?: Options) => {
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

type RemoveMessageValues = { id: string };

export const removeMessage = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.messages.remove);

  const mutate = useCallback(
    async (values: RemoveMessageValues, options?: Options) => {
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

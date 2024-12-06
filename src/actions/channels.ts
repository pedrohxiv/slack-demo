import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"channels"> | null) => void;
  onError?: (error: Error) => void;
};

type CreateChannelValues = { name: string; workspaceId: string };

export const createChannel = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.channels.create);

  const mutate = useCallback(
    async (values: CreateChannelValues, options?: Options) => {
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

type GetChannelsProps = { workspaceId: string };

export const getChannels = ({ workspaceId }: GetChannelsProps) => {
  const data = useQuery(api.channels.get, { workspaceId });

  return { data };
};

type GetChannelProps = { id: string };

export const getChannel = ({ id }: GetChannelProps) => {
  const data = useQuery(api.channels.getById, { id });

  return { data };
};

type UpdateChannelValues = { id: string; workspaceId: string; name: string };

export const updateChannel = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.channels.update);

  const mutate = useCallback(
    async (values: UpdateChannelValues, options?: Options) => {
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

type RemoveChannelValues = { id: string; workspaceId: string };

export const removeChannel = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.channels.remove);

  const mutate = useCallback(
    async (values: RemoveChannelValues, options?: Options) => {
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

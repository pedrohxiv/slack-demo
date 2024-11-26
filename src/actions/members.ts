import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const getCurrentMember = ({ workspaceId }: { workspaceId: string }) => {
  const data = useQuery(api.members.current, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};

export const getMembers = ({ workspaceId }: { workspaceId: string }) => {
  const data = useQuery(api.members.get, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};

export const getMember = ({ id }: { id: string }) => {
  const data = useQuery(api.members.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};

type Options = {
  onSuccess?: (data: Id<"members"> | null) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const updateMember = () => {
  const [data, setData] = useState<Id<"members"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.members.update);

  const mutate = useCallback(
    async (
      values: { id: string; role: "admin" | "member" },
      options?: Options
    ) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);

        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setStatus("error");

        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");

        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};

export const removeMember = () => {
  const [data, setData] = useState<Id<"members"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.members.remove);

  const mutate = useCallback(
    async (values: { id: string }, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);

        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setStatus("error");

        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");

        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};

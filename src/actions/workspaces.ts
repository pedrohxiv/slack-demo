import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"workspaces"> | null) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const createWorkspace = () => {
  const [data, setData] = useState<Id<"workspaces"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: { name: string }, options?: Options) => {
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

export const getWorkspaces = () => {
  const data = useQuery(api.workspaces.get);

  const isLoading = data === undefined;

  return { data, isLoading };
};

export const getWorkspace = ({ id }: { id: string }) => {
  const data = useQuery(api.workspaces.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};

export const updateWorkspace = () => {
  const [data, setData] = useState<Id<"workspaces"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.update);

  const mutate = useCallback(
    async (values: { id: string; name: string }, options?: Options) => {
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

export const removeWorkspace = () => {
  const [data, setData] = useState<Id<"workspaces"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.remove);

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

export const newJoinCode = () => {
  const [data, setData] = useState<Id<"workspaces"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.newJoinCode);

  const mutate = useCallback(
    async (values: { workspaceId: string }, options?: Options) => {
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

export const join = () => {
  const [data, setData] = useState<Id<"workspaces"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.join);

  const mutate = useCallback(
    async (
      values: { workspaceId: string; joinCode: string },
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

export const getWorkspaceInfo = ({ id }: { id: string }) => {
  const data = useQuery(api.workspaces.getInfoById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};

import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"workspaces"> | null) => void;
  onError?: (error: Error) => void;
};

type CreateWorkspaceValues = { name: string };

export const createWorkspace = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: CreateWorkspaceValues, options?: Options) => {
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

export const getWorkspaces = () => {
  const data = useQuery(api.workspaces.get);

  return { data };
};

type GetWorkspaceProps = { id: string };

export const getWorkspace = ({ id }: GetWorkspaceProps) => {
  const data = useQuery(api.workspaces.getById, { id });

  return { data };
};

type UpdateWorkspaceValues = { id: string; name: string };

export const updateWorkspace = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.workspaces.update);

  const mutate = useCallback(
    async (values: UpdateWorkspaceValues, options?: Options) => {
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

type RemoveWorkspaceValues = { id: string };

export const removeWorkspace = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.workspaces.remove);

  const mutate = useCallback(
    async (values: RemoveWorkspaceValues, options?: Options) => {
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

type NewJoinCodeValues = { workspaceId: string };

export const newJoinCode = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.workspaces.newJoinCode);

  const mutate = useCallback(
    async (values: NewJoinCodeValues, options?: Options) => {
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

type JoinValues = { workspaceId: string; joinCode: string };

export const join = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.workspaces.join);

  const mutate = useCallback(
    async (values: JoinValues, options?: Options) => {
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

type GetWorkspaceInfoProps = { id: string };

export const getWorkspaceInfo = ({ id }: GetWorkspaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });

  return { data };
};

import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Options = {
  onSuccess?: (data: Id<"members"> | null) => void;
  onError?: (error: Error) => void;
};

type GetCurrentMemberProps = { workspaceId: string };

export const getCurrentMember = ({ workspaceId }: GetCurrentMemberProps) => {
  const data = useQuery(api.members.current, { workspaceId });

  return { data };
};

type GetMembersProps = { workspaceId: string };

export const getMembers = ({ workspaceId }: GetMembersProps) => {
  const data = useQuery(api.members.get, { workspaceId });

  return { data };
};

type GetMemberProps = { id: string };

export const getMember = ({ id }: GetMemberProps) => {
  const data = useQuery(api.members.getById, { id });

  return { data };
};

type UpdateMemberValues = { id: string; role: "admin" | "member" };

export const updateMember = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.members.update);

  const mutate = useCallback(
    async (values: UpdateMemberValues, options?: Options) => {
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

type RemoveMemberValues = { id: string };

export const removeMember = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.members.remove);

  const mutate = useCallback(
    async (values: RemoveMemberValues, options?: Options) => {
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

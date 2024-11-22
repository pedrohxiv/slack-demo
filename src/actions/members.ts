import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

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

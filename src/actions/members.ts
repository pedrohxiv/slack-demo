import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

export const getCurrentMember = ({ workspaceId }: { workspaceId: string }) => {
  const data = useQuery(api.members.current, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};

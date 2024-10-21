import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

export const getChannels = ({ workspaceId }: { workspaceId: string }) => {
  const data = useQuery(api.channels.get, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};

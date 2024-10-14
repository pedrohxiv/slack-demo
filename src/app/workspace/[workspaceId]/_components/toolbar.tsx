import { Info, Search } from "lucide-react";
import { useParams } from "next/navigation";

import { getWorkspace } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  const params = useParams<{ workspaceId: string }>();

  const { data } = getWorkspace({ id: params.workspaceId });

  return (
    <div className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
          size="sm"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-sm capitalize">
            search {data?.name} workspace
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="icon">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

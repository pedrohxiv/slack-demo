import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Clock3,
  Search,
} from "lucide-react";
import { useParams } from "next/navigation";

import { getWorkspace } from "@/actions/workspaces";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Toolbar = () => {
  const params = useParams<{ workspaceId: string }>();

  const { data, isLoading } = getWorkspace({ id: params.workspaceId });

  return (
    <div className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="w-[27.5%] flex items-center justify-end px-2.5">
        <Hint label="Go back in history">
          <Button variant="transparent" size="icon">
            <ArrowLeft className="size-5 text-white" />
          </Button>
        </Hint>
        <Hint label="Advance in history">
          <Button variant="transparent" size="icon">
            <ArrowRight className="size-5 text-white" />
          </Button>
        </Hint>
        <Hint label="History">
          <Button variant="transparent" size="icon">
            <Clock3 className="size-5 text-white" />
          </Button>
        </Hint>
      </div>
      {isLoading ? (
        <Skeleton className="h-7 flex-1" />
      ) : (
        <div className="flex-1">
          <Hint label={`Search ${data?.name}`}>
            <Button
              className="bg-accent/25 hover:bg-accent/25 w-full justify-between h-7 px-2"
              size="sm"
            >
              <span className="text-white text-sm font-normal">
                Search {data?.name}
              </span>
              <Search className="size-4 text-white/60" />
            </Button>
          </Hint>
        </div>
      )}
      <div className="w-[25.5%] ml-auto flex items-center justify-end">
        <Hint label="Help">
          <Button variant="transparent" size="icon">
            <CircleHelp className="size-5 text-white" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

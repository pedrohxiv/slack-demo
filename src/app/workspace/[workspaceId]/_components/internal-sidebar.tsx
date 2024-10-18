import {
  AlertTriangle,
  ChevronDown,
  ListFilter,
  SquarePen,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { getCurrentMember } from "@/actions/members";
import { getWorkspace } from "@/actions/workspaces";
import { Hint } from "@/components/hint";
import { Preferences } from "@/components/modals/preferences";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const InternalSidebar = () => {
  const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false);

  const params = useParams<{ workspaceId: string }>();

  const { data: memberData, isLoading: memberIsLoading } = getCurrentMember({
    workspaceId: params.workspaceId,
  });
  const { data: workspaceData, isLoading: workspaceIsLoading } = getWorkspace({
    id: params.workspaceId,
  });

  if (memberIsLoading || workspaceIsLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full">
        <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
          <Skeleton className="h-8 w-36" />
          <div className="flex flex-row gap-1">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!memberData || !workspaceData) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <Preferences
        initialValue={workspaceData.name}
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
              variant="transparent"
            >
              <span className="truncate">{workspaceData.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64" side="bottom">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspaceData.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspaceData.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>
            {memberData.role === "admin" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {}}
                >
                  Invite people to {workspaceData.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button size="icon" variant="transparent">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button size="icon" variant="transparent">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </div>
  );
};

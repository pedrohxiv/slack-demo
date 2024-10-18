import { Bell, Home, MessagesSquare, MoreHorizontal, Plus } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { getWorkspace, getWorkspaces } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@/components/user-button";
import { cn } from "@/lib/utils";
import { useCreateWorkspace } from "@/store/create-workspace";

export const Sidebar = () => {
  const [_, setOpen] = useCreateWorkspace();

  const params = useParams<{ workspaceId: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const { data: workspaceData, isLoading: workspaceIsLoading } = getWorkspace({
    id: params.workspaceId,
  });
  const { data: workspacesData, isLoading: workspacesIsLoading } =
    getWorkspaces();

  const filteredWorkspaces = workspacesData?.filter(
    (workspace) => workspace._id !== params.workspaceId
  );

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {workspaceIsLoading ? (
            <Skeleton className="size-9" />
          ) : (
            <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
              {workspaceData?.name.charAt(0).toUpperCase()}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64" side="bottom">
          <DropdownMenuItem
            className="cursor-pointer flex-col justify-start items-start capitalize"
            onClick={() => router.push(`/workspace/${params.workspaceId}`)}
          >
            {workspaceData?.name}
            <span className="text-xs text-muted-foreground">
              Active Workspace
            </span>
          </DropdownMenuItem>
          {filteredWorkspaces?.map((workspace) => (
            <DropdownMenuItem
              className="cursor-pointer capitalize overflow-hidden"
              key={workspace._id}
              onClick={() => router.push(`/workspace/${workspace._id}`)}
            >
              <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <p className="truncate">{workspace.name}</p>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              <Plus />
            </div>
            Create a new workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
        <Button
          variant="transparent"
          className={cn("size-9 p-2 group-hover:bg-accent/20", {
            "bg-accent/20": pathname.includes("/workspace"),
          })}
        >
          <Home className="size-5 text-white group-hover:scale-110 transition-all" />
        </Button>
        <span className="text-[11px] text-white group-hover:text-accent">
          Home
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
        <Button
          variant="transparent"
          className={cn("size-9 p-2 group-hover:bg-accent/20", {
            "bg-accent/20": pathname.includes("/workspace"),
          })}
        >
          <MessagesSquare className="size-5 text-white group-hover:scale-110 transition-all" />
        </Button>
        <span className="text-[11px] text-white group-hover:text-accent">
          DMs
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
        <Button
          variant="transparent"
          className={cn("size-9 p-2 group-hover:bg-accent/20", {
            "bg-accent/20": pathname.includes("/workspace"),
          })}
        >
          <Bell className="size-5 text-white group-hover:scale-110 transition-all" />
        </Button>
        <span className="text-[11px] text-white group-hover:text-accent">
          Activity
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
        <Button
          variant="transparent"
          className={cn("size-9 p-2 group-hover:bg-accent/20", {
            "bg-accent/20": pathname.includes("/workspace"),
          })}
        >
          <MoreHorizontal className="size-5 text-white group-hover:scale-110 transition-all" />
        </Button>
        <span className="text-[11px] text-white group-hover:text-accent">
          More
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

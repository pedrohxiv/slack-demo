import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Clock3,
  Search,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { getChannels } from "@/actions/channels";
import { getMembers } from "@/actions/members";
import { getWorkspace } from "@/actions/workspaces";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

export const Toolbar = () => {
  const [open, setOpen] = useState<boolean>(false);

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { data: workspaceData, isLoading } = getWorkspace({
    id: params.workspaceId,
  });
  const { data: channelsData } = getChannels({
    workspaceId: params.workspaceId,
  });
  const { data: membersData } = getMembers({ workspaceId: params.workspaceId });

  const handleSelect = (route: string) => {
    setOpen(false);

    router.push(`/workspace/${params.workspaceId}${route}`);
  };

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
          <Hint label={`Search ${workspaceData?.name}`}>
            <Button
              className="bg-accent/25 hover:bg-accent/25 w-full justify-between h-7 px-2"
              onClick={() => setOpen(true)}
              size="sm"
            >
              <span className="text-white text-sm font-normal">
                Search {workspaceData?.name}
              </span>
              <Search className="size-4 text-white/60" />
            </Button>
          </Hint>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Channels">
                {channelsData?.map((channel) => (
                  <CommandItem
                    onSelect={() => handleSelect(`/channel/${channel._id}`)}
                  >
                    {channel.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Members">
                {membersData?.map((member) => (
                  <CommandItem
                    onSelect={() => handleSelect(`/member/${member._id}`)}
                  >
                    {member.user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
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

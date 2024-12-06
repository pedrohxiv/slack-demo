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

export const Toolbar = () => {
  const [open, setOpen] = useState<boolean>(false);

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { data: workspace } = getWorkspace({ id: params.workspaceId });
  const { data: channels } = getChannels({ workspaceId: params.workspaceId });
  const { data: members } = getMembers({ workspaceId: params.workspaceId });

  const handleSelect = (route: string) => {
    setOpen(false);

    router.push(`/workspace/${params.workspaceId}${route}`);
  };

  if (!workspace || !channels || !members) {
    return <div className="h-10 bg-[#481349]" />;
  }

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
      <div className="flex-1">
        <Hint label={`Search ${workspace.name}`}>
          <Button
            className="bg-accent/25 hover:bg-accent/25 w-full justify-between h-7 px-2"
            onClick={() => setOpen(true)}
            size="sm"
          >
            <span className="text-white text-sm font-normal">
              Search {workspace.name}
            </span>
            <Search className="size-4 text-white/60" />
          </Button>
        </Hint>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search channels or members" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels.map((channel) => (
                <CommandItem
                  className="cursor-pointer"
                  key={channel._id}
                  onSelect={() => handleSelect(`/channel/${channel._id}`)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members.map((member) => (
                <CommandItem
                  className="cursor-pointer"
                  key={member._id}
                  onSelect={() => handleSelect(`/member/${member._id}`)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
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

import {
  ChevronDown,
  Hash,
  MessageSquareText,
  Play,
  Plus,
  SendHorizonal,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { getChannels } from "@/actions/channels";
import { getCurrentMember, getMembers } from "@/actions/members";
import { getWorkspace } from "@/actions/workspaces";
import { Hint } from "@/components/hint";
import { Invite } from "@/components/modals/invite";
import { Preferences } from "@/components/modals/preferences";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCreateChannel } from "@/store/create-channel";

export const InternalSidebar = () => {
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false);
  const [channelsOpen, setChannelsOpen] = useState<boolean>(true);
  const [messagesOpen, setMessagesOpen] = useState<boolean>(true);
  const [_, setCreateChannelOpen] = useCreateChannel();

  const params = useParams<{
    workspaceId: string;
    channelId: string;
    memberId: string;
  }>();

  const { data: currentMember } = getCurrentMember({
    workspaceId: params.workspaceId,
  });
  const { data: workspace } = getWorkspace({
    id: params.workspaceId,
  });
  const { data: channels } = getChannels({
    workspaceId: params.workspaceId,
  });
  const { data: members } = getMembers({
    workspaceId: params.workspaceId,
  });

  if (!currentMember || !workspace || !channels || !members) {
    return null;
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <Invite
        name={workspace.name}
        joinCode={workspace.joinCode}
        open={inviteOpen}
        setOpen={setInviteOpen}
      />
      <Preferences
        initialValue={workspace.name}
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
      />
      <div className="flex items-center justify-between px-2 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="font-semibold text-lg w-auto ml-2 p-1.5 overflow-hidden"
              size="sm"
              variant="transparent"
            >
              <span className="text-white font-bold">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64" side="bottom">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>
            {currentMember.role === "admin" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to {workspace.name}
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
        <Hint label="New message" side="bottom">
          <Button
            className="border border-white/20"
            size="icon"
            variant="transparent"
          >
            <SquarePen className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex flex-col px-2 mt-3 gap-1">
        <Button
          asChild
          className="flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden text-[#F9EDFFCC]"
          size="sm"
          variant="transparent"
        >
          <Link href={`/workspace/${params.workspaceId}/channel/threads`}>
            <MessageSquareText className="size-3.5 mr-1 shrink-0" />
            <span className="text-sm truncate capitalize">Threads</span>
          </Link>
        </Button>
        <Button
          asChild
          className="flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden text-[#F9EDFFCC]"
          size="sm"
          variant="transparent"
        >
          <Link href={`/workspace/${params.workspaceId}/channel/drafts`}>
            <SendHorizonal className="size-3.5 mr-1 shrink-0" />
            <span className="text-sm truncate capitalize">Drafts & Sent</span>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col mt-3 px-2">
        <div className="flex items-center px-3.5 group">
          <Button
            className="p-0.5 text-sm text-[#F9EDFFCC] shrink-0 size-6"
            onClick={() => setChannelsOpen(!channelsOpen)}
            variant="transparent"
          >
            <Play
              className={cn(
                "fill-[#F9EDFFCC] size-2.5 transition-transform rotate-0",
                {
                  "rotate-90": channelsOpen,
                }
              )}
            />
          </Button>
          <Button
            className="group px-1.5 text-sm text-[#F9EDFFCC] h-[28px] justify-start overflow-hidden items-center"
            size="sm"
            variant="transparent"
          >
            <span className="truncate">Channels</span>
          </Button>
          {currentMember.role === "admin" && (
            <Hint label="New channel" side="top" align="center">
              <Button
                onClick={() => setCreateChannelOpen(true)}
                variant="transparent"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#F9EDFFCC] size-6 shrink-0"
              >
                <Plus className="size-5" />
              </Button>
            </Hint>
          )}
        </div>
        {channelsOpen &&
          channels.map((channel) => (
            <Button
              key={channel._id}
              asChild
              className={cn(
                "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden text-[#F9EDFFCC]",
                {
                  "text-[#481349] bg-white/90 hover:bg-white/90":
                    params.channelId === channel._id,
                }
              )}
              size="sm"
              variant="transparent"
            >
              <Link
                href={`/workspace/${params.workspaceId}/channel/${channel._id}`}
              >
                <Hash className="size-3.5 mr-1 shrink-0" />
                <span className="text-sm truncate capitalize">
                  {channel.name}
                </span>
              </Link>
            </Button>
          ))}
      </div>
      <div className="flex flex-col mt-3 px-2">
        <div className="flex items-center px-3.5 group">
          <Button
            className="p-0.5 text-sm text-[#F9EDFFCC] shrink-0 size-6"
            onClick={() => setMessagesOpen(!messagesOpen)}
            variant="transparent"
          >
            <Play
              className={cn(
                "fill-[#F9EDFFCC] size-2.5 transition-transform rotate-0",
                {
                  "rotate-90": messagesOpen,
                }
              )}
            />
          </Button>
          <Button
            className="group px-1.5 text-sm text-[#F9EDFFCC] h-[28px] justify-start overflow-hidden items-center"
            size="sm"
            variant="transparent"
          >
            <span className="truncate">Direct Messages</span>
          </Button>
          {currentMember.role === "admin" && (
            <Hint label="New direct message" side="top" align="center">
              <Button
                onClick={() => {}}
                variant="transparent"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#F9EDFFCC] size-6 shrink-0"
              >
                <Plus className="size-5" />
              </Button>
            </Hint>
          )}
        </div>
        {messagesOpen &&
          members.map((member) => (
            <Button
              key={member._id}
              asChild
              className={cn(
                "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden text-[#F9EDFFCC]",
                {
                  "text-[#481349] bg-white/90 hover:bg-white/90":
                    params.memberId === member._id,
                }
              )}
              size="sm"
              variant="transparent"
            >
              <Link
                href={`/workspace/${params.workspaceId}/member/${member._id}`}
              >
                <Avatar className="size-5 mr-1">
                  <AvatarImage src={member.user.image} />
                  <AvatarFallback>
                    {member.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{member.user.name}</span>
              </Link>
            </Button>
          ))}
      </div>
    </div>
  );
};

import { Check, Copy, RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { newJoinCode } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Props {
  name: string;
  joinCode: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Invite = ({ name, joinCode, open, setOpen }: Props) => {
  const [copied, setCopied] = useState<boolean>(false);

  const params = useParams<{ workspaceId: string }>();

  const { mutate } = newJoinCode();
  const { toast } = useToast();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${params.workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);

      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleNewCode = () => {
    mutate(
      { workspaceId: params.workspaceId },
      {
        onError: (error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 items-center justify-center py-10">
          <p className="text-4xl font-bold tracking-widest uppercase">
            {joinCode}
          </p>
          {!copied ? (
            <Button onClick={handleCopy} size="sm" variant="ghost">
              Copy link
              <Copy className="size-4 ml-2" />
            </Button>
          ) : (
            <p className="flex flex-row items-center justify-center text-sm font-medium h-8 rounded-md px-3">
              Link copied
              <Check className="size-4 ml-2" />
            </p>
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <Button onClick={handleNewCode} variant="outline">
            New Code
            <RefreshCcw className="size-4 ml-2" />
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

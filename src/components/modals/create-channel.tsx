import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { createChannel } from "@/actions/channels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateChannel } from "@/store/create-channel";

export const CreateChannel = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateChannel();

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { mutate, isPending } = createChannel();
  const { toast } = useToast();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name, workspaceId: params.workspaceId },
      {
        onSuccess: (id) => {
          router.push(`/workspace/${params.workspaceId}/channel/${id}`);

          handleClose();
        },
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            disabled={isPending}
            minLength={3}
            onChange={(e) =>
              setName(e.target.value.replace(/\s+/g, "-").toLowerCase())
            }
            placeholder="Name"
            required
            value={name}
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

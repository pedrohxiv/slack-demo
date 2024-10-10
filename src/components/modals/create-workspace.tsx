import { useRouter } from "next/navigation";
import { useState } from "react";

import { createWorkspace } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateWorkspace } from "@/store/create-workspace";

export const CreateWorkspace = () => {
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateWorkspace();

  const { mutate, isPending } = createWorkspace();
  const { toast } = useToast();

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess(id) {
          router.push(`/workspace/${id}`);

          handleClose();
        },
        onError(error) {
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
          <DialogTitle>Add a Workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            className=""
            disabled={isPending}
            minLength={3}
            onChange={(e) => setName(e.target.value)}
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

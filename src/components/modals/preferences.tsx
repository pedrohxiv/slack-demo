import { Trash, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { removeWorkspace, updateWorkspace } from "@/actions/workspaces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  initialValue: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Preferences = ({ initialValue, open, setOpen }: Props) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { mutate: updateMutate, isPending: updateIsPending } =
    updateWorkspace();
  const { mutate: removeMutate, isPending: removeIsPending } =
    removeWorkspace();
  const { toast } = useToast();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateMutate(
      { id: params.workspaceId, name: value },
      {
        onSuccess: () => {
          setOpen(false);
          setIsEditing(false);
          setValue(value);
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

  const handleRemove = () => {
    removeMutate(
      { id: params.workspaceId },
      {
        onSuccess: () => {
          setOpen(false);
          setIsEditing(false);
          setValue(initialValue);

          router.replace("/");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{initialValue}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          {!isEditing ? (
            <div
              className={cn(
                "px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50",
                {
                  "pointer-events-none opacity-50":
                    updateIsPending || removeIsPending,
                }
              )}
              onClick={() => setIsEditing(true)}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Workspace name</p>
                <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                  Edit
                </p>
              </div>
              <p className="text-sm">{value}</p>
            </div>
          ) : (
            <form
              className="relative flex flex-row items-center justify-between gap-2"
              onSubmit={handleEdit}
            >
              <Input
                autoFocus
                disabled={updateIsPending || removeIsPending}
                minLength={3}
                maxLength={80}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Name"
                required
                value={value}
              />
              <X
                className={cn("absolute right-2 cursor-pointer", {
                  "pointer-events-none opacity-50":
                    updateIsPending || removeIsPending,
                })}
                onClick={() => {
                  setIsEditing(false);
                  setValue(initialValue);
                }}
              />
            </form>
          )}
          <button
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 disabled:pointer-events-none disabled:opacity-50"
            disabled={updateIsPending || removeIsPending}
            onClick={handleRemove}
          >
            <Trash className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

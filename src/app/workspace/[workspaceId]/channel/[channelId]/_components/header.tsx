import { Trash, X } from "lucide-react";
import { useState } from "react";

import { removeChannel, updateChannel } from "@/actions/channels";
import { getCurrentMember } from "@/actions/members";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  const [value, setValue] = useState<string>(title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const params = useParams<{ workspaceId: string; channelId: string }>();
  const router = useRouter();

  const { data } = getCurrentMember({ workspaceId: params.workspaceId });
  const { mutate: updateMutate, isPending: updateIsPeding } = updateChannel();
  const { mutate: removeMutate, isPending: removeIsPeding } = removeChannel();
  const { toast } = useToast();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateMutate(
      { id: params.channelId, workspaceId: params.workspaceId, name: value },
      {
        onSuccess: () => {
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
      { id: params.channelId, workspaceId: params.workspaceId },
      {
        onSuccess: () => {
          setIsEditing(false);
          setValue(title);

          router.replace(`/workspace/${params.workspaceId}`);
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
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      {data?.role !== "admin" ? (
        <span className="text-lg font-bold px-2 overflow-hidden w-auto truncate">
          # {title}
        </span>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Hint label="Get channel details" side="bottom">
              <Button
                className="text-lg font-bold px-2 overflow-hidden w-auto"
                size="sm"
                variant="ghost"
              >
                <span className="truncate"># {title}</span>
              </Button>
            </Hint>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              {!isEditing ? (
                <div
                  className={cn(
                    "px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50",
                    {
                      "pointer-events-none opacity-50":
                        updateIsPeding || removeIsPeding,
                    }
                  )}
                  onClick={() => setIsEditing(true)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              ) : (
                <form
                  className="relative flex flex-row items-center justify-between gap-2"
                  onSubmit={handleEdit}
                >
                  <Input
                    autoFocus
                    disabled={updateIsPeding || removeIsPeding}
                    minLength={3}
                    maxLength={80}
                    onChange={(e) =>
                      setValue(
                        e.target.value.replace(/\s+/g, "-").toLowerCase()
                      )
                    }
                    placeholder="Name"
                    required
                    value={value}
                  />
                  <X
                    className={cn("absolute right-2 cursor-pointer", {
                      "pointer-events-none opacity-50":
                        updateIsPeding || removeIsPeding,
                    })}
                    onClick={() => {
                      setIsEditing(false);
                      setValue(title);
                    }}
                  />
                </form>
              )}
              <button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600 disabled:pointer-events-none disabled:opacity-50"
                disabled={updateIsPeding || removeIsPeding}
                onClick={handleRemove}
              >
                <Trash className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

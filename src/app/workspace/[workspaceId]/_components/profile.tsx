import { ChevronDown, Mail, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  getCurrentMember,
  getMember,
  removeMember,
  updateMember,
} from "@/actions/members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Props {
  memberId: string;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: Props) => {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { data: currentMemberData, isLoading: currentMemberIsLoading } =
    getCurrentMember({ workspaceId: params.workspaceId });
  const { data: memberData, isLoading: memberIsLoading } = getMember({
    id: memberId,
  });
  const { mutate: updateMutate, isPending: updateIsPeding } = updateMember();
  const { mutate: removeMutate, isPending: removeIsPeding } = removeMember();
  const { toast } = useToast();

  const handleUpdate = (role: "admin" | "member") => {
    updateMutate(
      { id: memberId, role },
      {
        onSuccess: () => {
          onClose();
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
      { id: memberId },
      {
        onSuccess: () => {
          onClose();
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

  const handleLeave = () => {
    removeMutate(
      { id: memberId },
      {
        onSuccess: () => {
          onClose();

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

  if (
    !currentMemberData ||
    currentMemberIsLoading ||
    !memberData ||
    memberIsLoading
  ) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between h-[49px] items-center px-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size="sm" variant="ghost">
          <X className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full">
          <AvatarImage src={memberData.user.image} />
          <AvatarFallback className="aspect-square text-6xl">
            {memberData.user.name?.[0] || "M"}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{memberData.user.name}</p>
        {currentMemberData.role === "admin" &&
        currentMemberData._id === memberId ? (
          <div className="flex items-center gap-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full capitalize" variant="outline">
                  {memberData.role} <ChevronDown className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup
                  onValueChange={(role) =>
                    handleUpdate(role as "admin" | "member")
                  }
                  value={memberData.role}
                >
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="member">
                    Member
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="w-full" onClick={handleRemove} variant="outline">
              Remove
            </Button>
          </div>
        ) : (
          currentMemberData._id === memberId &&
          currentMemberData.role !== "admin" && (
            <div className="mt-4">
              <Button
                className="w-full"
                onClick={handleLeave}
                variant="outline"
              >
                Leave
              </Button>
            </div>
          )
        )}
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact Information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <Mail className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              className="text-sm hover:underline text-[#1264A3]"
              href={`mailto:${memberData.user.email}`}
            >
              {memberData.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

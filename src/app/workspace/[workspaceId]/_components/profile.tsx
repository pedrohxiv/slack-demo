import { Mail, X } from "lucide-react";
import Link from "next/link";

import { getMember } from "@/actions/members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  memberId: string;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: Props) => {
  const { data: memberData, isLoading: memberIsLoading } = getMember({
    id: memberId,
  });

  if (!memberData || memberIsLoading) {
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

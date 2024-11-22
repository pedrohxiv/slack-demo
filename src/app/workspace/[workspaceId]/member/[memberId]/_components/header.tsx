import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Props {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({ memberName, memberImage, onClick }: Props) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        onClick={onClick}
        size="sm"
        variant="ghost"
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{memberName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <ChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};

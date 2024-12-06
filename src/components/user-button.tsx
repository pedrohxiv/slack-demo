"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

import { getCurrentUser } from "@/actions/users";
import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserButton = () => {
  const { data } = getCurrentUser();
  const { signOut } = useAuthActions();

  if (!data || !data.name) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Hint label={data.name} side="right">
          <Avatar className="size-10 hover:opacity-75 transition">
            <AvatarImage alt={data.name} src={data.image} />
            <AvatarFallback className="text-xl">
              {data.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Hint>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-60" side="right">
        <DropdownMenuItem
          className="h-10 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

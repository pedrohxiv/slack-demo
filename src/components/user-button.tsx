"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

import { getCurrentUser } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const UserButton = () => {
  const { data, isLoading } = getCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return <Skeleton className="size-10 rounded-md" />;
  }

  if (!data || !data.image || !data.name) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="rounded-md size-10 hover:opacity-75 transition">
          <AvatarImage
            alt={data.name}
            className="rounded-md"
            src={data.image}
          />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {data.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
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

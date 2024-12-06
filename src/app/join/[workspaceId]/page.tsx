"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { getWorkspaceInfo, join } from "@/actions/workspaces";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

const JoinPage = () => {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const { data } = getWorkspaceInfo({ id: params.workspaceId });
  const { mutate } = join();
  const { toast } = useToast();

  const handleComplete = (value: string) => {
    if (value.length === 6) {
      mutate(
        { workspaceId: params.workspaceId, joinCode: value },
        {
          onSuccess: (id) => {
            router.replace(`/workspace/${id}`);
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
    }
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.isMember) {
      router.replace(`/workspace/${params.workspaceId}`);
    }
  }, [data, router, params.workspaceId]);

  if (!data) {
    return;
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Icons.logo className="size-20 -m-10" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter workspace code to join.
          </p>
        </div>
        <InputOTP
          autoFocus
          maxLength={6}
          pattern="^[a-zA-Z0-9]+$"
          onChange={(value) => handleComplete(value)}
        >
          <InputOTPGroup className="uppercase text-lg font-medium text-gray-500">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex gap-x-4">
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;

"use client";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";

const RootPage = () => {
  const { signOut } = useAuthActions();

  return <Button onClick={() => signOut()}>Sign Out</Button>;
};

export default RootPage;

import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Props {
  setType: (type: "signIn" | "signUp") => void;
}

export const SignIn = ({ setType }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const { signIn } = useAuthActions();

  const handlePasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);

    signIn("password", { email, password, flow: "signIn" })
      .catch(() => setError("Invalid email or password."))
      .finally(() => setIsPending(false));
  };

  const handleProviderSignIn = (value: "google") => {
    setIsPending(true);

    signIn(value).finally(() => setIsPending(false));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Login with email or connect with a service to continue.
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handlePasswordSignIn}>
          <Input
            disabled={isPending}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
          <Input
            disabled={isPending}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
          <Button
            className="w-full"
            disabled={isPending}
            size="lg"
            type="submit"
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            disabled={isPending}
            onClick={() => handleProviderSignIn("google")}
            size="lg"
            variant="outline"
          >
            <Icons.google className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <span
            className={cn("ml-1 text-sky-700 hover:underline cursor-pointer", {
              "opacity-50 hover:no-underline cursor-default": isPending,
            })}
            onClick={() => setType("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

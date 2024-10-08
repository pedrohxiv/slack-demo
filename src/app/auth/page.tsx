"use client";

import { useState } from "react";

import { SignIn } from "./_components/sign-in";
import { SignUp } from "./_components/sign-up";

const AuthPage = () => {
  const [type, setType] = useState<"signIn" | "signUp">("signIn");

  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {type === "signIn" ? (
          <SignIn setType={setType} />
        ) : (
          <SignUp setType={setType} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;

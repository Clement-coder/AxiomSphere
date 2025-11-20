import React, { useEffect } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export const LoginModalButton: React.FC = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    console.log("Privy state in button:", { ready, authenticated });
  }, [ready, authenticated]);

  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated }) => {
      console.log("Login complete, user:", user, "isNewUser:", isNewUser);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Privy login error:", error);
    },
  });

  const handleClick = () => {
    if (!ready) {
      console.warn("Tried to login, but Privy not ready");
      return;
    }
    login();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!ready || authenticated}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {authenticated ? "Continue" : "Sign Up / Log In"}
    </button>
  );
};

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { LoginModalButton } from "@/components/loginModalButton";

export default function AuthPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">⚡ Autonomous DApp</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Sign in to deploy and manage your AI agents
        </p>

        <LoginModalButton />

        {!ready && (
          <p className="mt-4 text-xs text-muted-foreground">Loading authentication…</p>
        )}
      </div>
    </div>
  );
}

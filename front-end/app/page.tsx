"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { LoginModalButton } from "@/components/loginModalButton";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const hasRedirected = useRef(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-primary" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              AxiomSphere
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your Gateway to Decentralized Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div className="glass border-glow rounded-lg p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Sign in to deploy and manage your AI agents
            </p>
          </div>
          
          <LoginModalButton />

          {!ready && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Initializing authentication...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by decentralized AI technology</p>
        </div>
      </div>
    </div>
  );
}
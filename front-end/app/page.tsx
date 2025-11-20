"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { LoginModalButton } from "@/components/loginModalButton";
import Image from "next/image";

export default function AuthPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <div>
          <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AxiomSphere
          </h1>
          <p className="mt-3 text-lg text-center text-gray-300">
            Your Gateway to Decentralized Intelligence
          </p>
        </div>

        <div className="w-full my-8 border-t border-gray-700"></div>

        <div className="w-full text-center">
          <p className="mb-6 text-gray-400">
            Sign in to deploy and manage your AI agents.
          </p>
          <LoginModalButton />
        </div>

        {!ready && (
          <div className="absolute bottom-4 text-xs text-gray-500">
            Initializing authentication...
          </div>
        )}
      </div>
    </main>
  );
}

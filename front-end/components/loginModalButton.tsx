import React, { useState, useRef, useEffect } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { storeUser, User } from "@/lib/storage";
import { LogIn } from "lucide-react";

export const LoginModalButton: React.FC = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hasHandledLogin = useRef(false);

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/dashboard");
    }
  }, [ready, authenticated, router]);

  const { login } = useLogin({
    onComplete: ({ user: privyUser, isNewUser, wasAlreadyAuthenticated }) => {
      // Prevent multiple executions
      if (hasHandledLogin.current) {
        return;
      }
      hasHandledLogin.current = true;

      console.log("Login complete, user:", privyUser, "isNewUser:", isNewUser);

      try {
        // Map Privy user to local User interface and store it
        const newUser: User = {
          id: privyUser.id,
          email: privyUser.email?.address || "",
          password: "",
          balance: 0,
          username: privyUser.github?.username || 
                   privyUser.google?.name || 
                   privyUser.email?.address?.split('@')[0] || 
                   "User",
        };
        
        console.log("Storing user:", newUser);
        storeUser(newUser);
        console.log("User stored successfully");

        setLoading(false);
        router.replace("/dashboard");
      } catch (error) {
        console.error("Error storing user:", error);
        setLoading(false);
        hasHandledLogin.current = false;
      }
    },
    onError: (error) => {
      if (error.message === "exited_auth_flow") {
        console.warn("Privy login flow exited by user.");
      } else {
        console.error("Privy login error:", error);
      }
      setLoading(false);
      hasHandledLogin.current = false;
    },
  });

  const handleClick = () => {
    if (!ready) {
      console.warn("Privy not ready yet");
      return;
    }
    
    if (authenticated) {
      // Already authenticated, should have been redirected by useEffect
      return;
    }

    setLoading(true);
    hasHandledLogin.current = false;
    login();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!ready || loading || authenticated} // Disable if authenticated to prevent multiple redirects
      className="relative w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
          <span>Signing In...</span>
        </>
      ) : (
        <>
          <LogIn size={20} />
          <span>Sign Up / Log In</span>
        </>
      )}
    </button>
  );
};
import React, { useEffect, useState } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { storeUser, User } from "@/lib/storage"; // Import storeUser and User

export const LoginModalButton: React.FC = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Privy state in button:", { ready, authenticated });
  }, [ready, authenticated]);

  const { login } = useLogin({
    onComplete: ({ user: privyUser, isNewUser, wasAlreadyAuthenticated }) => { // Renamed user to privyUser to avoid conflict
      console.log("Login complete, user:", privyUser, "isNewUser:", isNewUser);

      // Map Privy user to local User interface and store it
      const newUser: User = {
        id: privyUser.id,
        email: privyUser.email?.address || "", // Use email if available
        password: "", // Privy doesn't expose password
        balance: 0, // Initialize balance for new users
        username: privyUser.github?.username || privyUser.google?.name || privyUser.email?.address?.split('@')[0],
      };
      storeUser(newUser); // Store the user in local storage

      setLoading(false);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Privy login error:", error);
      setLoading(false);
    },
  });

  const handleClick = () => {
    if (!ready) {
      console.warn("Tried to login, but Privy not ready");
      return;
    }
    setLoading(true);
    login();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!ready || authenticated || loading}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {authenticated ? "Continue to Dashboard" : (loading ? "Signing In..." : "Sign Up / Log In")}
    </button>
  );
};

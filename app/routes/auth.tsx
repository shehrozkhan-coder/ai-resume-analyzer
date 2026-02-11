import { useEffect, useRef } from "react";
import type { Route } from "./+types/auth";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";

export const meta: Route.MetaFunction = () => [
  { title: "ResuLenz-AI | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    if (auth.isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate(next, { replace: true });
    }
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl gradient-border shadow-xl rounded-2xl">
        <section className="flex flex-col gap-6 sm:gap-8 bg-white rounded-2xl p-6 sm:p-8 lg:p-10">
          
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Welcome
            </h1>
            <h2 className="text-sm sm:text-base lg:text-lg text-gray-600">
              Log In to Continue Your Job
            </h2>
          </div>

          <div className="w-full">
            {isLoading ? (
              <button className="auth-button w-full animate-pulse">
                <p>Signing you in ....</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="auth-button w-full"
                    onClick={auth.signOut}
                  >
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button
                    className="auth-button w-full"
                    onClick={auth.signIn}
                  >
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>

        </section>
      </div>
    </main>
  );
};

export default Auth;
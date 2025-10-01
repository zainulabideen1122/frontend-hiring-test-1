import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/utils/auth";

const PUBLIC_PATHS = ["/auth/login", "/login"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Auth guard: redirect unauthenticated users
  useEffect(() => {
    if (
      !isAuthenticated() &&
      !PUBLIC_PATHS.includes(window.location.pathname)
    ) {
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <ToastProvider>
      <Layout onLogout={handleLogout}>
        <Component {...pageProps} />
      </Layout>
    </ToastProvider>
  );
}

import HeaderBar from "@/components/Header";
import { useRouter } from "next/router";

export default function Layout({ children, onLogout }) {
  const router = useRouter();
  const publicPaths = ["/auth/login", "/login"];
  const showHeader = !publicPaths.includes(router.pathname);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {showHeader ? <HeaderBar onLogout={onLogout} /> : null}
      {children}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

export default function HeaderBar({ onLogout }) {
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Turing Technologies"
            width={250}
            height={250}
          />
        </Link>
        <button
          onClick={onLogout}
          className="px-4 py-1.5 rounded bg-primary text-primary-foreground text-sm cursor-pointer"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

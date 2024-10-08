import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 h-16 bg-white text-gray-800 shadow-md z-50 flex items-center justify-between px-8">
      <div className="flex items-center">
        <div className="text-lg font-semibold">
          <h3>
            <Link href="/">
              <img src="library.png" alt="logo" className="h-8" />
            </Link>
          </h3>
        </div>
      </div>
      <nav className="flex items-center gap-6"></nav>
      <div className="flex items-center gap-4"></div>
    </header>
  );
}

"use client";

import { GlobalAlert } from "@shared/components/Alert";
import { NavBar, SideBar } from "@shared/components/NavigationBar";
import { GlobalProvider } from "@shared/context/GlobalContext";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const folders = [
    "transactions",
    "renews",
    "reservations",
    "books",
    "categories",
    "rooms",
    "room-types",
    "timeslot",
    "Room-time-table",
    "users",
  ];

  useEffect(() => {
    if (isLoginPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoginPage]);

  return (
    <GlobalProvider>
      <GlobalAlert />
      <div className="flex flex-col h-full min-h-screen">
        {isLoginPage ? (
          <main>{children}</main>
        ) : (
          <>
            <div className="fixed top-0 left-0 right-0 z-10">
              <NavBar />
            </div>
            <div className="flex flex-grow pt-[64px]">
              <button
                className="lg:hidden fixed top-[64px] left-4 z-20 p-4 bg-gray-800 text-white rounded-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              </button>
              <div
                className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] transition-all duration-300 ease-in-out z-10 ${
                  isSidebarOpen ? "w-72" : "w-0"
                }`}
              >
                <SideBar folders={folders} />
              </div>
              <main
                className={`flex-grow p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? "ml-60" : "ml-55"
                }`}
              >
                {children}
              </main>
            </div>
          </>
        )}
      </div>
    </GlobalProvider>
  );
}

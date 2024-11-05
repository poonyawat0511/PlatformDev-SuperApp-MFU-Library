"use client";
import { usePathname, useRouter } from "next/navigation";
import * as Icons from "@heroicons/react/24/outline";
import React, { useState } from "react";

export function NavBar() {
  const router = useRouter();
  return (
    <div className="navbar h-1 border-b dark:border-neutral-800 backdrop-blur-md">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => router.push("/")}>
          University Management
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a href="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SideBar({ folders = [] }: { folders: string[] }) {
  const pathname = usePathname(); // Get the current pathname
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar visibility

  // Filter out the "auth" folder from the provided folders array
  const filteredFolders = folders.filter(folder => folder !== "auth");

  const Folders = [
    { name: "books", icon: "BookOpenIcon" },
    { name: "users", icon: "UserIcon" },
    { name: "transactions", icon: "CreditCardIcon" },
    { name: "reservations", icon: "CalendarIcon" },
    { name: "renews", icon: "NewspaperIcon" },
    { name: "categories", icon: "ChartBarIcon" },
    { name: "room-types", icon: "Squares2X2Icon" },
    { name: "rooms", icon: "CubeIcon" },
    { name: "timeslot", icon: "ClockIcon" },
    { name: "Room-time-table", icon: "TableCellsIcon" },
  ];

  type IconNames = keyof typeof Icons;

  return (
    <div
      style={{
        height: "calc(100vh - 4rem)",
        width: isCollapsed ? "80px" : "240px", // Set width based on state
      }}
      className="border-r dark:border-neutral-800 backdrop-blur-md overflow-y-auto transition-all duration-300"
    >
      <div className="flex items-center justify-between p-4">
        <div className={`text-2xl font-semibold ${isCollapsed ? 'hidden' : ''}`}>Menu</div>
        <button onClick={() => setIsCollapsed(prev => !prev)} className="btn btn-ghost">
          {isCollapsed ? <Icons.ArrowRightIcon width={20} /> : <Icons.ArrowLeftIcon width={20} />}
        </button>
      </div>
      <ul className="menu font-medium">
        <li>
          <a href="/" className={pathname === "/" ? "active" : ""}>
            <div className="p-2 border rounded-full">
              <Icons.HomeIcon width={20} strokeWidth={1.5} />
            </div>{" "}
            {!isCollapsed && "Home"}
          </a>
        </li>
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => {
            // Find the corresponding icon from the Folders array
            const folderData = Folders.find((f) => f.name === folder);
            const IconComponent = folderData
              ? Icons[folderData.icon as IconNames]
              : Icons.EllipsisVerticalIcon; // Get the icon component

            // Capitalize the first letter for display
            const capitalizedFolder =
              folder.charAt(0).toUpperCase() + folder.slice(1);

            return (
              <li key={folder}>
                <a
                  href={`/${folder}`} // Use href for navigation
                  className={pathname === `/${folder}` ? "active" : ""}
                >
                  <div className="p-2 border rounded-full mr-2"> {/* เพิ่ม margin-right */}
                    {IconComponent ? (
                      <IconComponent width={20} strokeWidth={1.5} />
                    ) : (
                      <Icons.EllipsisVerticalIcon width={20} strokeWidth={1.5} />
                    )}
                  </div>
                  {!isCollapsed && capitalizedFolder} {/* แสดงชื่อ folder เมื่อไม่หุบ */}
                </a>
              </li>
            );
          })
        ) : (
          <li>No folders available</li>
        )}
      </ul>
    </div>
  );
}
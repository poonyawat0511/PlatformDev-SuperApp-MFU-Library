"use client"
import { usePathname, useRouter } from "next/navigation";
import * as Icons from "@heroicons/react/24/outline";
import React from "react";

export function NavBar() {
  const router = useRouter();
  return (
    <div className="navbar h-1 border-b dark:border-neutral-800 backdrop-blur-md">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => router.push('/')}>University Management</a>
      </div>
      <div className="flex-none">
        {/* <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-semibold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div> */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
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

  type IconNames = keyof typeof Icons;

  return (
    <div style={{ height: 'calc(100vh - 4rem)' }} className="border-r dark:border-neutral-800 backdrop-blur-md overflow-y-auto">
      <div className="text-2xl font-semibold py-4 px-4">Menu</div>
      <ul className="menu font-medium">
        <li>
          <a href="/" className={pathname === '/' ? 'active' : ''}>
            <div className="p-2 border rounded-full"><Icons.HomeIcon width={20} strokeWidth={1.5} /></div> Home
          </a>
        </li>
        {folders.length > 0 ? (
          folders.map((folder) => {
            // Capitalize the first letter for display
            const capitalizedFolder = folder.charAt(0).toUpperCase() + folder.slice(1);
            const iconName = `${capitalizedFolder}Icon` as IconNames; // Cast to IconNames
            const IconComponent = Icons[iconName]; // Access the icon

            return (
              <li key={folder}>
                <a
                  href={`/${folder}`} // Use href for navigation
                  className={pathname === `/${folder}` ? 'active' : ''}
                >
                  <div className="p-2 border rounded-full">
                    {IconComponent ? <IconComponent width={20} strokeWidth={1.5} /> : <Icons.EllipsisVerticalIcon width={20} strokeWidth={1.5} />}
                  </div>
                  {capitalizedFolder} {/* Display folder name */}
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
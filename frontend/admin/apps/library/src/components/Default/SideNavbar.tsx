"use client";

import Link from "next/link";
import { BiSolidCategory, BiSolidCategoryAlt } from "react-icons/bi";
import { FaRegUserCircle, FaUserCog } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";
import { IoBook } from "react-icons/io5";
import { MdAutorenew, MdMeetingRoom } from "react-icons/md";
import { RiCalendarTodoFill, RiReservedFill } from "react-icons/ri";
import { SiGoogleforms } from "react-icons/si";

export default function SideNavbar() {
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8082/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Force a full page reload to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-[220px] max-w-xs h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 bg-white text-gray border-r border-gray-200 shadow-lg flex flex-col">
      <div className="px-4 py-4 flex-1 overflow-y-auto">
        <div className="mt-8">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <HiChartPie className="text-lg" />
              <span className="text-base">Dashboard</span>
            </Link>
            <Link
              href="/transactions"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <RiCalendarTodoFill className="text-lg" />
              <span className="text-base">Transactions management</span>
            </Link>
            <Link
              href="/books"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <IoBook className="text-lg" />
              <span className="text-base">Books management</span>
            </Link>
            <Link
              href="/rooms"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <MdMeetingRoom className="text-lg" />
              <span className="text-base">Rooms management</span>
            </Link>
            <Link
              href="/reservations"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <RiReservedFill className="text-lg" />
              <span className="text-base">Reservations management</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <BiSolidCategory className="text-lg" />
              <span className="text-base">Categories management</span>
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <FaUserCog className="text-lg" />
              <span className="text-base">Users management</span>
            </Link>
            <Link
              href="/renews"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <MdAutorenew className="text-lg" />
              <span className="text-base">Renews management</span>
            </Link>
            <Link
              href="/room-types"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <BiSolidCategoryAlt className="text-lg" />
              <span className="text-base">Room-Type</span>
            </Link>
            <Link
              href="/recommend-forms"
              className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
            >
              <SiGoogleforms className="text-lg" />
              <span className="text-base">Recommend-Form</span>
            </Link>
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
        >
          <FaRegUserCircle className="text-lg" />
          <span className="text-base">Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-gray-400 py-2 px-4 rounded-lg mt-2 hover:bg-gray-700 hover:text-white transition duration-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

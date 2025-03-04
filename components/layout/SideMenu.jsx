"use client";
import { logout } from "@/action/auth";
import { MENU_DATA } from "@/lib/data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const handleClick = async (route) => {
    if (route === "/logout") {
      await logout();
      return;
    }
    router.push(route);
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-slate-50/50 border-r border-slate-100/70 p-5 sticky top-[61px] z-20">
      {MENU_DATA.map((item) => {
        const isActive = pathname === item.path; // Check if the link is active

        return item.path === "/logout" ? (
          <button
            key={item.id}
            className="flex w-full items-center gap-4 text-[15px]  py-4 px-6 mb-3 rounded-full transition-colors hover:bg-gray-200 cursor-pointer"
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" /> {item.label}
          </button>
        ) : (
          <Link
            key={item.id}
            href={item.path}
            className={`flex w-full items-center gap-4 text-[15px] py-4 px-6 mb-3 rounded-full transition-colors ${
              isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            <item.icon className="text-xl" /> {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default SideMenu;

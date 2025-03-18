"use client";
import { logout } from "@/action/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuLogOut, LuMenu } from "react-icons/lu";
import SideMenu from "./SideMenu";

const Navbar = ({ user }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const profileRef = useRef(null);

  const handleClick = async () => {
    const user = await logout();
    toast.success(user.message);
    router.push("/login");
  };

  // Close openProfile when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }

    if (openProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfile]);

  return (
    <div className="flex gap-5 border-b border-white bg-slate-50/50 backdrop-blur-[2px] p-4 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <div className="flex justify-between items-center w-full">
        <h2 className="text-lg font-medium text-black">Polling App</h2>
        <div
          ref={profileRef}
          onClick={() => setOpenProfile(!openProfile)}
          className="relative cursor-pointer bg-primary/20 rounded-lg"
        >
          <div className="flex items-center justify-between gap-2 py-1 px-2">
            <Image
              src={user.user.profileImage}
              height={200}
              width={200}
              alt="Profile image"
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
            <LuMenu size={25} />
          </div>

          <div
            className={`w-[calc(100vw-48px)] sm:!w-[343px] fixed sm:!absolute bg-white top-[60px] right-0 smx:-right-4 left-4 sm:left-[-270px] rounded-lg overflow-visible z-[15] shadow-lg p-2
            transition-all duration-300 ease-in-out transform ${
              openProfile
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-3 pointer-events-none"
            }`}
          >
            <div className="bg-slate-100/80 p-2 rounded-md gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={user?.user.profileImage}
                  height={200}
                  width={200}
                  alt="Profile image"
                  className="w-14 h-14 rounded-full border-2 border-primary"
                />
                <div>
                  <h3 className="text-lg text-gray-950 font-medium">
                    {user?.user.fullname}
                  </h3>
                  <p className="text-[13px] font-medium text-slate-700">
                    @{user?.user.username}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm text-black mt-2">
                  <span className="font-medium">Polls Created:</span>{" "}
                  {user.totalPollsCreated || 0}
                </h3>
                <h3 className="text-sm text-black mt-2">
                  <span className="font-medium">Polls Voted:</span>{" "}
                  {user?.totalPollsVote || 0}
                </h3>
                <h3 className="text-sm text-black mt-2">
                  <span className="font-medium">Polls Bookmarked:</span>{" "}
                  {user?.totalBookmarkedPolls || 0}
                </h3>
              </div>

              <div className="flex gap-2 mt-3 -mb-2">
                <Link
                  className="flex w-full items-center gap-2 text-[15px] py-2 px-4 mb-3 cursor-pointer btn-small2 font-semibold"
                  href="/profile"
                >
                  <CgProfile /> Profile
                </Link>
                <button
                  className="flex w-full items-center gap-2 text-[15px] py-2 px-4 mb-3 cursor-pointer btn-small2 font-semibold"
                  onClick={handleClick}
                >
                  <LuLogOut /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu />
        </div>
      )}
    </div>
  );
};

export default Navbar;

import { FaPerson } from "react-icons/fa6";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearVoteStatus } from "../../redux/voterSlice";
import { GiVote } from "react-icons/gi";
import { IoExitOutline, IoListSharp } from "react-icons/io5";

export default function VoterSidebarComp() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.search]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearVoteStatus());
    toast.success("You logged out successfully");
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col md:justify-between bg-slate-100 dark:bg-slate-950 h-full">
      {/* content */}
      <div>
        {/* heading */}
        <div
          className="flex justify-between items-center mr-5 cursor-pointer md:hidden px-2 py-4 text-xl uppercase"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <h1
            className={`font-semibold text-lg mt-1 ml-3 ${
              isOpen && "text-blue-600"
            }`}
          >
            contents
          </h1>
          <IoListSharp
            className={`md:hidden text-2xl hover:text-blue-600 hover:scale-110 transition-all duration-150 ease-in-out focus:text-blue-700 ${
              isOpen && "scale-105 text-blue-600"
            }`}
          />
        </div>
        <h1 className="hidden md:block font-semibold mt-1 px-2 py-4 text-xl uppercase ml-3">
          Contents
        </h1>
        <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />

        {/* content */}
        <div className={`${isOpen ? "block" : "hidden"}`}>
          <Link to="/dashboard/?tab=elections">
            <div
              className={`flex flex-row  items-center py-4 px-2 gap-x-3 transition-all duration-150 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-800 ${
                (tab === "elections" || !tab) &&
                "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <GiVote className="text-3xl" />
              <span>Elections</span>
            </div>
          </Link>
          <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />

          <Link to="/dashboard/?tab=profile">
            <div
              className={`flex flex-row  items-center py-4 px-2 gap-x-3 transition-all duration-150 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-800   ${
                tab === "profile" && "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <FaPerson className="text-3xl" />
              <span>Profile</span>
            </div>
          </Link>
          <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />
        </div>
      </div>
      {/* logout */}
      <div className={`w-full ${isOpen ? "block" : "hidden"}`}>
        <div className="hidden md:block h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />
        <button className="w-full" onClick={handleLogout}>
          <div className="flex flex-row items-center py-5 px-2 gap-x-3 transition-all duration-150 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
            <IoExitOutline className="text-3xl" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}

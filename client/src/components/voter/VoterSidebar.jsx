import { Sidebar } from "flowbite-react";
import { FaPerson } from "react-icons/fa6";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearVoteStatus } from "../../redux/voterSlice";
import { GiVote } from "react-icons/gi";
import { IoExitOutline, IoListSharp } from "react-icons/io5";

export default function VoterSideBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearVoteStatus());
    toast.success("You logged out successfully");
    navigate("/");
  };

  return (
    <div>
      <Sidebar className="w-full md:w-60">
        <Sidebar.Items>
          <div
            className="flex justify-between items-center mr-5 cursor-pointer md:hidden"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            <h1
              className={`font-semibold text-lg mt-1 ml-3 ${
                isOpen && "text-blue-600"
              }`}
            >
              Menu
            </h1>
            <IoListSharp
              className={`md:hidden text-2xl hover:text-blue-600 hover:scale-110 transition-all duration-150 ease-in-out focus:text-blue-700 ${
                isOpen && "scale-105 text-blue-600"
              }`}
            />
          </div>
          <h1 className="hidden md:block font-semibold text-lg mt-1 ml-3">
            Menu
          </h1>
          <Sidebar.ItemGroup className={`${isOpen ? "block" : "hidden"}`}>
            <Sidebar.Item
              as={Link}
              to="/voter-election-dashboard"
              icon={GiVote}
              active={location.pathname === "/voter-election-dashboard"}
            >
              Elections
            </Sidebar.Item>
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700 mt-2" />
            <Sidebar.Item
              as={Link}
              to="/voter-profile"
              icon={FaPerson}
              active={location.pathname === "/voter-profile"}
            >
              Your Profile
            </Sidebar.Item>
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700 mt-2" />
            <Sidebar.Item
              onClick={handleLogout}
              icon={IoExitOutline}
              className="cursor-pointer"
            >
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

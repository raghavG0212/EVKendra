import { Sidebar } from "flowbite-react";
import { FaPerson } from "react-icons/fa6";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { clearVoteStatus } from "../../redux/voterSlice";
import { GiVote } from "react-icons/gi";
import { CiCircleList } from "react-icons/ci";
import { IoExitOutline, IoListSharp } from "react-icons/io5";

export default function VoterSideBar() {
  const location = useLocation();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/election/getAll");
        const filteredElections = response.data.filter(
          ({ startDate, endDate }) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return (start <= today && end >= today) || today > end;
          }
        );
        setElections(filteredElections);
      } catch {
        toast.error("Failed to load elections");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

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

  const handleNavigation = (election) => {
    navigate(
      `/election/${election._id}/vote?startDate=${election.startDate}?endDate=${election.endDate}`
    );
    if (window.innerWidth > 768) {
      window.scrollTo(0, 0);
    }
    setIsCollapsed(true);
    toast.info(election.name)
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearVoteStatus());
    toast.success("You logged out successfully");
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }
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
            <Sidebar.Collapse
              label="Elections"
              icon={GiVote}
              open={!isCollapsed}
              onClick={() => {
                setIsCollapsed((prev) => !prev);
              }}
            >
              {elections.map((election, index) => (
                <Sidebar.Item
                  key={election._id}
                  as="button"
                  onClick={() => handleNavigation(election)}
                  active={
                    location.pathname === `/election/${election._id}/vote`
                  }
                  icon={CiCircleList}
                  className={`hover:text-blue-500 dark:hover:text-blue-500 `}
                >
                  <div className="flex flex-col text-start text-wrap">
                    {election.name}
                    <div
                      className={`flex items-center font-bold ${
                        new Date(election.endDate) < today
                          ? "text-gray-400"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-3 font-semibold">
                        {new Date(election.endDate) < today ? "Ended" : "Live"}
                      </span>
                      {new Date(election.endDate) >= today && (
                        <span className=" w-2 h-2 bg-red-600 rounded-full animate-pulse mt-[5px]"></span>
                      )}
                    </div>
                  </div>
                  {index + 1 < elections.length && (
                    <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700 mt-2" />
                  )}
                </Sidebar.Item>
              ))}
            </Sidebar.Collapse>
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

import { Sidebar} from "flowbite-react";
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
  const [isOpen , setIsOpen] = useState(true);
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
      } 
      finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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
          <div className="flex justify-between items-center mr-5">
            <h1 className="font-semibold text-lg mt-1 ml-3">Menu</h1>
            <IoListSharp
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
              className="md:hidden text-2xl hover:text-blue-600 transition-all duration-150 ease-in-out focus:text-blue-700"
            />
          </div>
          <Sidebar.ItemGroup className={`${isOpen ? "block" : "hidden"}`}>
            <Sidebar.Collapse label="Elections" icon={GiVote}>
              {elections.map((election) => (
                <Sidebar.Item
                  key={election._id}
                  as={Link}
                  to={`/election/${election._id}/candidates/vote`}
                  state={{ endDate: election.endDate }}
                  active={
                    location.pathname ===
                    `/election/${election._id}/candidates/vote`
                  }
                  icon={CiCircleList}
                  className={`hover:text-blue-500 dark:hover:text-blue-500 `}
                >
                  <div className="flex flex-col text-wrap">
                    {election.name}
                    <div
                      className={`relative flex items-center font-bold ${
                        new Date(election.endDate) < today
                          ? "text-gray-400"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-3 font-semibold">
                        {new Date(election.endDate) < today ? "Ended" : "Live"}
                      </span>
                      {new Date(election.endDate) >= today && (
                        <span className="absolute right-0 w-2 h-2 bg-red-600 rounded-full animate-pulse mt-1"></span>
                      )}
                    </div>
                  </div>
                </Sidebar.Item>
              ))}
            </Sidebar.Collapse>
            <Sidebar.Item
              as={Link}
              to="/voter-profile"
              icon={FaPerson}
              active={location.pathname === "/voter-profile"}
            >
              Your Profile
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup className={`${isOpen ? "block" : "hidden"}`}>
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

import { Sidebar, Drawer } from "flowbite-react";
import { FaArrowRight, FaPerson } from "react-icons/fa6";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { clearVoteStatus } from "../../redux/voterSlice";
import { GiVote } from "react-icons/gi";

export default function VoterDrawer({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();

   useEffect(() => {
     const handleResize = () => {
       if (window.innerWidth < 768) {
         setIsOpen(false);
       }
     };
     handleResize();
     window.addEventListener("resize", handleResize);
     return () => window.removeEventListener("resize", handleResize);
   }, []);

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
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchElections();
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
    <Drawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="h-full"
    >
      <Drawer.Header title="Overview" />
      <Drawer.Items className="h-full">
        <Sidebar className="h-full w-full">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
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
                  icon={GiVote}
                  className={`hover:text-blue-500 dark:hover:text-blue-500`}
                >
                  <div className="flex flex-col">
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
              <Sidebar.Item
                as={Link}
                to="/voter-profile"
                icon={FaPerson}
                active={location.pathname === "/voter-profile"}
              >
                Your Profile
              </Sidebar.Item>
              <Sidebar.Item
                onClick={handleLogout}
                icon={FaArrowRight}
                className="cursor-pointer"
              >
                Logout
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </Drawer.Items>
    </Drawer>
  );
}

import { Button, Sidebar, Modal, Label, TextInput } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { FaPerson } from "react-icons/fa6";
import { GiVote } from "react-icons/gi";
import { CiCircleList } from "react-icons/ci";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoCreateSharp, IoExitOutline, IoListSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import Loader from "../Loader";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createElectionModal, setCreateElectionModal] = useState(false);
  const [isOpen , setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const today = new Date();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/election/getAll");
        setElections(response.data);
      } catch (err) {
        toast.error("Failed to load elections");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
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

  const handleAddElection = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/election/create-election", {
        name,
        startDate,
        endDate,
      });
      const updatedElections = await axios.get(`/api/v1/election/getAll`);
      setElections(updatedElections.data);
      setCreateElectionModal(false);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create election.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth > 768) {
      window.scrollTo(0, 0);
    }
    setIsCollapsed(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You logged out successfully");
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Sidebar className="w-full md:w-60 mb-5 md:mb-0">
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
          <Sidebar.ItemGroup className={`${isOpen ? "block" : "hidden"} `}>
            <Sidebar.Item
              as={Link}
              to="/admin-dashboard"
              icon={HiChartPie}
              active={location.pathname === "/admin-dashboard"}
            >
              Dashboard
            </Sidebar.Item>
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />
            <Sidebar.Item
              icon={IoCreateSharp}
              className="cursor-pointer font-bold"
            >
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => setCreateElectionModal(true)}
                outline
                className="w-full"
              >
                Add New Election
              </Button>
            </Sidebar.Item>
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />
            <Sidebar.Collapse
              icon={GiVote}
              label="Elections"
              open={!isCollapsed}
              onClick={() => {
                setIsCollapsed((prev) => !prev);
              }}
            >
              {elections
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .map((election, index) => (
                  <Sidebar.Item
                    key={election._id}
                    as="button"
                    onClick={() =>
                      handleNavigation(`/election/${election._id}/candidates`)
                    }
                    icon={CiCircleList}
                    active={
                      location.pathname ===
                      `/election/${election._id}/candidates`
                    }
                  >
                    <div className="flex flex-col text-start text-wrap">
                      {election.name}
                      {new Date(election.startDate) > today ? (
                        <div className="relative flex items-center font-bold text-green-500">
                          <span className="mr-3 font-semibold">Upcoming</span>
                        </div>
                      ) : new Date(election.endDate) < today ? (
                        <div className="relative flex items-center font-bold text-gray-400">
                          <span className="mr-3 font-semibold">Ended</span>
                        </div>
                      ) : (
                        <div className="flex items-center font-bold text-red-600">
                          <span className="mr-3 font-semibold">Live</span>
                          <span className=" w-2 h-2 bg-red-600 rounded-full animate-pulse mt-[3.5px]"></span>
                        </div>
                      )}
                    </div>
                    {index + 1 < elections.length && (
                      <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700 mt-2" />
                    )}
                  </Sidebar.Item>
                ))}
            </Sidebar.Collapse>
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />
            <Sidebar.Item
              as={Link}
              to="/admin-profile"
              icon={FaPerson}
              active={location.pathname === "/admin-profile"}
            >
              Your Profile
            </Sidebar.Item>
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 dark:from-slate-400 dark:via-slate-500 dark:to-slate-700" />
            <Sidebar.Item
              onClick={handleLogout}
              icon={IoExitOutline}
              className="hover:text-blue-500 cursor-pointer dark:hover:text-blue-500"
            >
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* create-election */}
      <Modal
        show={createElectionModal}
        onClose={() => setCreateElectionModal(false)}
      >
        <Modal.Header>Create Election</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" value="Election Name" />
              <TextInput
                id="name"
                placeholder="Enter election name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate" value="Start Date" />
              <TextInput
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate" value="End Date" />
              <TextInput
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddElection}>Create Election</Button>
          <Button color="gray" onClick={() => setCreateElectionModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

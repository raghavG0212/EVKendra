import {
  Button,
  Card,
  Modal,
  Table,
  Spinner,
  Label,
  TextInput,
} from "flowbite-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin2Line, RiAdminLine } from "react-icons/ri";
import { HiOutlineExclamationCircle, HiOutlinePencil } from "react-icons/hi";
import {
  MdOutlineEventAvailable,
  MdLiveTv,
  MdEventBusy,
  MdOutlineFactCheck,
  MdHowToVote,
} from "react-icons/md";
import { GiVote } from "react-icons/gi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Heading from "../Heading";
import { deleteElection, setElections } from "../../redux/electionSlice";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function AdminMainDash() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const elections = useSelector((state) => state.election.electionList);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [admins, setAdmins] = useState([]);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [voters, setVoters] = useState(0);
  const [voterData, setVoterData] = useState([]);
  const today = new Date();
  const [electionEditModal, setElectionEditModal] = useState(false);
  const [electionDeleteModal, setElectionDeleteModal] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  const [electionToEdit, setElectionToEdit] = useState(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/admin/getAdmins");
        setAdmins(response.data.admins);
        setCreator(response.data.creator);
      } catch (err) {
        toast.error("Failed to load admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchVotersJoinedData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/voter/voters-per-month");
        setVoterData(response.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Error fetching voters data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVotersJoinedData();
  }, []);

  const chartData = {
    labels: voterData.map((data) => data.month),
    datasets: [
      {
        label: "Voters Joined",
        data: voterData.map((data) => data.count),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Voters",
        },
      },
    },
  };

  const upcomingElections = elections.filter(
    (election) => new Date(election.startDate) > today
  );
  const liveElections = elections.filter(
    (election) =>
      new Date(election.startDate) < today && new Date(election.endDate) > today
  );
  const endedElections = elections.filter(
    (election) => new Date(election.endDate) < today
  );
  const declaredElections = elections.filter(
    (election) => election.result?.winner
  );

  useEffect(() => {
    const countVoters = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/voter/count-voter");
        setVoters(response.data.count);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching voters");
      } finally {
        setLoading(false);
      }
    };
    countVoters();
  }, []);

  const fetchElections = async () => {
    try {
      const updatedElections = await axios.get(`/api/v1/election/getAll`);
      dispatch(setElections(updatedElections.data));
    } catch (err) {
      console.error("Failed to fetch elections:", err);
    }
  };

  useEffect(() => {
    fetchElections();
  }, [dispatch]);

  const handleAdminDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `/api/v1/admin/delete-admin/${adminToDelete}`
      );
      setOpenDeleteModal(false);
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin._id !== adminToDelete)
      );
      toast.success(response.data.message || "Admin deleted successfully");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Cannot delete Admin");
      } else if (err.response?.status === 404) {
        toast.error("Admin not found.");
      } else {
        toast.error(err.response?.data?.message || "Error deleting admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditElection = async () => {
    setLoading(true);
    try {
      const updatedElection = {
        name: name || electionToEdit?.name,
        startDate: startDate || electionToEdit?.startDate,
        endDate: endDate || electionToEdit?.endDate,
      };

      const response = await axios.put(
        `/api/v1/election/edit-election/${electionToEdit}`,
        updatedElection
      );
      await fetchElections();
      toast.success(response.data.message || "Details updated successfully");
      setElectionEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to edit election");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteElection = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `/api/v1/election/delete-election/${electionToDelete}`
      );
      dispatch(deleteElection(electionToDelete));
      await fetchElections();
      setElectionDeleteModal(false);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete election.");
    } finally {
      setLoading(false);
    }
  };

  const NavigateToElection = (election) => {
    navigate(`/election/${election._id}/candidates`);
    window.scroll(0, 0);
    toast.info(election.name);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen cursor-default ">
      <AdminSidebar className="h-full md:w-60" />
      <div className="flex flex-col flex-grow h-full md:mx-8 mb-10">
        <div className="grid grid-cols-1 450px:grid-cols-2 1016px:grid-cols-3 gap-3 m-4 p-2 italic lowercase font-serif">
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>Voters</h1>
            <div className="flex justify-center text-5xl">
              <MdHowToVote />
            </div>
            <p className="text-blue-600">{voters}</p>
          </Card>
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>Admins</h1>
            <div className="flex justify-center text-5xl">
              <RiAdminLine />
            </div>
            <p className="text-blue-600">{admins.length}</p>
          </Card>
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>Elections</h1>
            <div className="flex justify-center text-5xl">
              <GiVote />
            </div>
            <p className="text-blue-600">{elections.length}</p>
          </Card>
        </div>

        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col xl:flex-grow">
            <Heading heading="voter enrollment" />
            <div className="mt-5 flex justify-center">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="flex flex-col xl:w-1/2 xl:mx-auto">
            <Heading heading="executive board" />
            <div className="m-5">
              <Table className="shadow-md mt-4">
                <Table.Head>
                  <Table.HeadCell className="border-r">Name</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {admins.map((admin) => (
                    <Table.Row key={admin._id}>
                      <Table.Cell className="border-r font-semibold flex justify-between items-center">
                        <span
                          className={`${
                            currentUser._id === admin._id && "text-blue-600"
                          } text-[20px] `}
                        >
                          {" "}
                          {admin.name}
                        </span>
                        {admin._id === creator._id && (
                          <span className="text-[10px] sm:text-[16px] capitalize bg-cyan-600 text-white px-3 sm:py-1 rounded-md font-mono mt-1.5 sm:mt-0">
                            creator
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {currentUser._id === admin._id ||
                        admin._id === creator._id ? (
                          <button>
                            <RiDeleteBin2Line className="text-2xl text-gray-300 dark:text-gray-600" />
                          </button>
                        ) : (
                          <button
                            className="text-red-500 hover:scale-110 transition-all duration-150 ease-in-out"
                            onClick={() => {
                              setAdminToDelete(admin._id);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <RiDeleteBin2Line className="text-2xl hover:text-red-700" />
                          </button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>

        <Heading heading="Election Overview" />

        <div className="grid grid-cols-1 450px:grid-cols-2 1016px:grid-cols-3 gap-3 m-4 p-3 italic font-serif">
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>upcoming</h1>
            <div className="flex justify-center text-5xl">
              <MdOutlineEventAvailable />
            </div>
            <p className="text-blue-600">{upcomingElections.length}</p>
          </Card>
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>live</h1>
            <div className="flex justify-center text-5xl">
              <MdLiveTv />
            </div>
            <p className="text-blue-600">{liveElections.length}</p>
          </Card>
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>ended</h1>
            <div className="flex justify-center text-5xl">
              <MdEventBusy />
            </div>
            <p className="text-blue-600">{endedElections.length}</p>
          </Card>
          <Card className="text-center text-2xl lg:text-3xl bg-slate-100 mb-3 sm:mb-0">
            <h1>declared</h1>
            <div className="flex justify-center text-5xl">
              <MdOutlineFactCheck />
            </div>
            <p className="text-blue-600">{declaredElections.length}</p>
          </Card>
        </div>

        <div className="m-5">
          <Table className="shadow-md">
            <Table.Head>
              <Table.HeadCell className="border-r">Name</Table.HeadCell>
              <Table.HeadCell className="border-r">
                Active Period
              </Table.HeadCell>
              <Table.HeadCell className="border-r hidden 1016px:table-cell">
                Candidates
              </Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {elections
                .slice()
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .map((election) => (
                  <Table.Row
                    key={election._id}
                    className="hover:bg-slate-200 dark:hover:bg-slate-900"
                  >
                    <Table.Cell
                      className="font-semibold hover:underline text-wrap cursor-pointer"
                      onClick={() => NavigateToElection(election)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="sm:text-[16px]">{election.name}</span>

                        {election.result?.winner && (
                          <MdOutlineFactCheck className="text-green-600 xl:mr-16" />
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell
                      className={`md:text-lg font-medium ${
                        new Date(election.endDate) < today
                          ? "text-gray-400"
                          : new Date(election.startDate) > today
                          ? "text-green-600"
                          : "text-red-600 animate-pulse"
                      }`}
                    >
                      {new Date(election.startDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }
                      )}{" "}
                      - <br></br>
                      {new Date(election.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </Table.Cell>
                    <Table.Cell className="text-[19px] hidden 1016px:table-cell">
                      {election.candidates.length}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col md:flex-row md:space-x-2 space-y-1 md:space-y-0">
                        <button
                          className={`${
                            new Date() < new Date(election.endDate)
                              ? "text-green-500 hover:scale-110 transition-all duration-150 ease-in-out"
                              : "text-gray-300 dark:text-gray-600"
                          } `}
                          onClick={() => {
                            setElectionEditModal(true);
                            setElectionToEdit(election._id);
                            setName(election.name);
                            setStartDate(
                              new Date(election.startDate)
                                .toISOString()
                                .split("T")[0]
                            );
                            setEndDate(
                              new Date(election.endDate)
                                .toISOString()
                                .split("T")[0]
                            );
                          }}
                          disabled={new Date() > new Date(election.endDate)}
                        >
                          <HiOutlinePencil className="text-2xl" />
                        </button>
                        <button
                          className={`${
                            new Date() < new Date(election.endDate) &&
                            new Date() > new Date(election.startDate)
                              ? "text-gray-300 dark:text-gray-600"
                              : "text-red-500 hover:scale-110 transition-all duration-150 ease-in-out}"
                          }`}
                          onClick={() => {
                            setElectionDeleteModal(true);
                            setElectionToDelete(election._id);
                          }}
                          disabled={
                            new Date() < new Date(election.endDate) &&
                            new Date() > new Date(election.startDate)
                          }
                        >
                          <RiDeleteBin2Line className="text-2xl" />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/*Election Edit Modal */}
      <Modal
        show={electionEditModal}
        onClose={() => setElectionEditModal(false)}
      >
        <Modal.Header>Edit Election</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" value="Election Name" />
              <TextInput
                id="name"
                placeholder="Enter election name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" value="Start Date" />
              <TextInput
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={new Date() > new Date(startDate)}
              />
            </div>
            <div className="space-y-2">
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
          <Button onClick={handleEditElection} color="success">
            Edit Details
          </Button>
        </Modal.Footer>
      </Modal>

      {/* election-delete-Modal */}
      <Modal
        size="md"
        show={electionDeleteModal}
        onClose={() => setElectionDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are You Sure , You Want to Delete this Election?
            </h3>
            <div className="flex justify-center gap-8">
              <Button color="success" outline onClick={handleDeleteElection}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Yes I'm Sure"
                )}
              </Button>
              <Button
                color="failure"
                outline
                onClick={() => setElectionDeleteModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* admin-modal */}
      <Modal
        size="md"
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are You Sure ?
            </h3>
            <div className="flex justify-center gap-8">
              <Button color="success" outline onClick={handleAdminDelete}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Yes I'm Sure"
                )}
              </Button>
              <Button
                color="failure"
                outline
                onClick={() => setOpenDeleteModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

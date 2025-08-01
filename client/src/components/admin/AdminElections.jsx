import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setElections, deleteElection } from "../../redux/electionSlice";
import AdminSidebar from "./AdminSidebar";
import {
  Button,
  Label,
  Modal,
  Table,
  TextInput,
  Spinner,
  Pagination,
} from "flowbite-react";
import { MdOutlineFactCheck } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { HiOutlineExclamationCircle, HiOutlinePencil } from "react-icons/hi";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import { toast } from "react-toastify";
import Loader from "../Loader";

export default function AdminElections() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterType, setFilterType] = useState("all");
  const elections = useSelector((state) => state.election.electionList);
  const [electionBar, setElectionBar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [createElectionModal, setCreateElectionModal] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const today = new Date();
  const [electionEditModal, setElectionEditModal] = useState(false);
  const [electionDeleteModal, setElectionDeleteModal] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  const [electionToEdit, setElectionToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);

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
    setCurrentPage(1);
  }, [dispatch, filterType]);

  const handleAddElection = async () => {
    setLoading(true);
    if (name === "" || startDate === "" || endDate === "") {
      setLoading(false);
      return toast.error("Fill all details");
    }
    try {
      const response = await axios.post("/api/v1/election/create-election", {
        name,
        startDate,
        endDate,
      });
      const updatedElections = await axios.get(`/api/v1/election/getAll`);
      dispatch(setElections(updatedElections.data));
      setCreateElectionModal(false);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create election.");
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
    navigate(`/election/${election._id}/candidates`, {
      state: {
        Ename: election.name,
        startDate: election.startDate,
        endDate: election.endDate,
      },
    });
    window.scroll(0, 0);
  };

  const filteredElections = elections
    .filter((election) => {
      const now = new Date();
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);

      if (filterType === "live") return start <= now && end >= now;
      if (filterType === "upcoming") return start > now;
      if (filterType === "ended") return end < now;
      return true;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const electionsPerPage = 8;
  const totalPages = Math.ceil(filteredElections.length / electionsPerPage);
  const startIndex = (currentPage - 1) * electionsPerPage;
  const paginatedElections = filteredElections.slice(
    startIndex,
    startIndex + electionsPerPage
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar className="h-full md:w-60" />
      <div className="flex-grow cursor-default">
        <div className="flex flex-col">
          <div className="flex justify-between pt-3 px-3">
            <button
              onClick={() => {
                setElectionBar((prev) => !prev);
              }}
            >
              <div className="flex flex-row hover:opacity-80 active:opacity-70">
                <h1 className="p-2 font-semibold text-xl sm:text-2xl uppercase font-serif">
                  Elections
                </h1>
                <div
                  className={`flex transition-all duration-200 ease-in-out ${
                    electionBar && "rotate-90 ml-1.5"
                  }`}
                >
                  <div className="h-7 w-1 bg-red-600 mr-1 mt-2"></div>
                  <div className="h-7 w-1 bg-blue-700 mt-2"></div>
                </div>
              </div>
            </button>

            <div className="px-4 mb-1">
              {" "}
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => setCreateElectionModal(true)}
                outline
                className="w-full"
              >
                Add New Election
              </Button>
            </div>
          </div>
          <div
            className={` flex flex-row overflow-hidden transition-all duration-500 ease-in-out transform  bg-gradient-to-r from-blue-200 dark:from-blue-400
    ${
      electionBar
        ? "max-h-40 opacity-100 scale-y-100"
        : "max-h-0 opacity-0 scale-y-0"
    }
  `}
          >
            {["all", "live", "upcoming", "ended"].map((type) => (
              <div
                key={type}
                className={`cursor-pointer font-semibold text-lg sm:text-xl transition-all duration-200 ease-in-out flex-grow py-2 text-center hover:text-violet-950  dark:hover:text-white  text-violet-700 dark:text-violet-100 uppercase  ${
                  filterType === type
                    ? "border-b-4 border-b-violet-950 dark:border-b-white bg-violet-100 dark:bg-violet-700"
                    : ""
                }`}
                onClick={() => setFilterType(type)}
              >
                {type}
              </div>
            ))}
          </div>
          <div className="min-h-screen">
            <Table className="shadow-md mt-6">
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
                {filteredElections.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-lg font-semibold text-gray-500"
                    >
                      No elections available.
                    </td>
                  </tr>
                ) : (
                  paginatedElections.map((election) => (
                    <Table.Row
                      key={election._id}
                      className="hover:bg-slate-200 dark:hover:bg-slate-900"
                    >
                      <Table.Cell
                        className="font-semibold  text-wrap cursor-pointer"
                        onClick={() => NavigateToElection(election)}
                      >
                        <div className="flex items-center">
                          <span
                            className={`sm:text-[16px] ${
                              new Date(election.endDate) < today
                                ? "text-gray-400"
                                : new Date(election.startDate) > today
                                ? "text-green-600"
                                : "text-red-600 "
                            }`}
                          >
                            {election.name}
                          </span>
                           
                          {election.result?.winner && (
                            <MdOutlineFactCheck className="text-green-600 dark:text-green-700 text-xl mt-1 mx-4" />
                          )}
                          {new Date(election.startDate) < today &&
                            new Date(election.endDate) > today && (
                              <div className="size-2 mt-1 animate-pulse rounded-full bg-red-600 mx-1" />
                            )}
                        </div>
                      </Table.Cell>

                      <Table.Cell
                        className={`md:text-lg font-medium ${
                          new Date(election.endDate) < today
                            ? "text-gray-400"
                            : new Date(election.startDate) > today
                            ? "text-green-600"
                            : "text-red-600 "
                        }`}
                      >
                        {new Date(election.startDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                        <br />
                        {new Date(election.endDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
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
                            }`}
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
                                : "text-red-500 hover:scale-110 transition-all duration-150 ease-in-out"
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
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
          <div className="flex overflow-x-auto sm:justify-center my-10">
            <Pagination
              layout="navigation"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo(0, 0);
              }}
              showIcons
            />
          </div>
          <div className="m-4 flex p-3 flex-col capitalize border-[3px] border-cyan-600">
            <h1 className="mb-2 text-red-600">Important notes :-</h1>
            <span className="flex items-center gap-1">
              <VscDebugBreakpointLogUnverified className="text-red-600" />
              Live elections can only be edited.
            </span>
            <span className="flex items-center gap-1">
              <VscDebugBreakpointLogUnverified className="text-red-600" />
              ended elections can only be deleted.
            </span>
            <span className="flex items-center gap-1">
              <VscDebugBreakpointLogUnverified className="text-red-600" />
              Upcoming elections can be edited and deleted.
            </span>
          </div>
        </div>
      </div>
      {/* create-election */}
      <Modal
        show={createElectionModal}
        onClose={() => setCreateElectionModal(false)}
      >
        <Modal.Header>Create Election</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" value="Election Name" />
              <TextInput
                id="name"
                type="text"
                required
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
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" value="End Date" />
              <TextInput
                id="endDate"
                type="date"
                required
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
    </div>
  );
}

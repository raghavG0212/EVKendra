import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setVoteStatus, selectElectionById } from "../../redux/voterSlice";
import { HashLink as Link } from "react-router-hash-link";
import { toast } from "react-toastify";
import Loader from "../Loader";
import moment from "moment";

export default function VotingComp({id}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const election = useSelector((state) => selectElectionById(state, id));
  const [candidateID, setCandidateID] = useState(null);
  const { Ename, startDate, endDate } = location.state || {};

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/v1/election/${id}/candidates/getAll`
        );
        setCandidates(response.data);
      } catch (err) {
        toast.error("Failed to load candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [id]);

  const handleVoteExecution = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/voter/cast-vote", {
        voterID: currentUser.voterID,
        eid: id,
        cid: candidateID,
      });
      if (response.status === 200) {
        setShowModal(false);
        dispatch(setVoteStatus({ electionID: id, voted: true }));
        navigate("/voting-success", { state: { eid: id } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex-grow border-r-2 cursor-default mt-6 md:mt-0 min-h-screen">
      <div>
        <div className="flex justify-center items-center mt-1 mb-2 p-4 bg-slate-300 dark:bg-slate-700 rounded-md">
          <div className="text-center">
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold font-mono text-stone-900 dark:text-white">
              {Ename}
            </h1>
            <p className="text-xs sm:text-sm font-light md:text-lg text-stone-700 dark:text-stone-400">
              {moment(startDate).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
        <Table className="w-full  dark:text-white">
          <Table.Head>
            <Table.HeadCell className="border-r">Name</Table.HeadCell>
            <Table.HeadCell className="border-r">Party Name</Table.HeadCell>
            <Table.HeadCell className="hidden sm:block border-r">
              Party Logo
            </Table.HeadCell>
            <Table.HeadCell>
              <div>Actions</div>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y border-b">
            {candidates
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((candidate) => (
                <Table.Row key={candidate._id}>
                  <Table.Cell className="uppercase font-semibold border-r">
                    {candidate.name}
                  </Table.Cell>
                  <Table.Cell className="border-r">
                    {candidate.partyName}
                  </Table.Cell>
                  <Table.Cell className="hidden sm:table-cell border-r">
                    <div className="ml-3 md:ml-0 880px:ml-3 h-12 w-12 flex justify-center items-center bg-white dark:border-gray-700 rounded-full">
                      <img
                        src={candidate.partyLogo}
                        alt={candidate.partyName}
                        className="h-12 w-12 rounded-full"
                        loading="lazy"
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date() > new Date(endDate) ? (
                      <span className="text-red-600 sm:text-lg">
                        Election Ended
                      </span>
                    ) : election?.voted ? (
                      <span className="text-green-600  sm:text-xl">voted</span>
                    ) : (
                      <Button
                        gradientDuoTone="pinkToOrange"
                        className="hover:opacity-70"
                        onClick={() => {
                          setShowModal(true);
                          setCandidateID(candidate._id);
                        }}
                      >
                        Vote
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div>
          <div className="m-10 flex justify-center">
            <Link to="/#upcoming-elections">
              <Button gradientDuoTone="redToYellow" className="w-60">
                Check Upcoming Elections
              </Button>
            </Link>
          </div>
          <div className="m-10 flex justify-center">
            <Link to="/#results">
              <Button gradientDuoTone="redToYellow" className="w-60">
                Check Results Here
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
        root="show"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are You Sure ?
            </h3>
            <div className="flex justify-center gap-8">
              <Button color="success" onClick={handleVoteExecution}>
                {loading ? (
                  <div>
                    <Spinner />
                    loading...
                  </div>
                ) : (
                  " Yes, I'm sure"
                )}
              </Button>
              <Button color="failure" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

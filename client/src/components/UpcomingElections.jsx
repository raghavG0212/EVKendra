import { Button, Card, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  FaArrowAltCircleDown,
  FaCalendarAlt,
  FaUserCheck,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { HiExclamationCircle } from "react-icons/hi";
import Heading from "./Heading";

export default function UpcomingElections() {
  const [loading, setLoading] = useState(false);
  const [elections, setElections] = useState([]);
  const [candidatesByElection, setCandidatesByElection] = useState({});
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
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const fetchCandidates = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/election/${id}/candidates/getAll`
      );
      return response.data;
    } catch (err) {
      toast.error("Error in getting elections");
      return [];
    }
  };

  const calculateDates = (election) => {
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    const registrationDeadline = new Date(startDate);
    registrationDeadline.setDate(registrationDeadline.getDate() - 15);

    const resultDate = new Date(endDate);
    resultDate.setDate(resultDate.getDate() + 30);

    return { registrationDeadline, resultDate };
  };

  useEffect(() => {
    const fetchAllCandidates = async () => {
      if (elections.length > 0) {
        const candidatesPromises = elections.map((election) =>
          fetchCandidates(election._id)
        );
        const candidatesResults = await Promise.all(candidatesPromises);

        const candidatesByElectionTemp = {};
        elections.forEach((election, index) => {
          candidatesByElectionTemp[election._id] = candidatesResults[index];
        });
        setCandidatesByElection(candidatesByElectionTemp);
      }
    };

    fetchAllCandidates();
  }, [elections]);

  const upcomingElections = elections
    .filter((election) => new Date(election.startDate) > today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div>
      <Heading heading="upcoming elections" />
      {upcomingElections.length === 0 ? (
        <div className="flex flex-col justify-center items-center m-16 p-10 bg-red-600 dark:bg-inherit bg-opacity-30 border border-slate-200 dark:border-teal-600 dark:bg-gray-800 rounded ">
          <HiExclamationCircle className="text-6xl mb-2" />
          <h1 className=" text-lg sm:text-2xl text-center text-nowrap">
            No Upcoming Elections
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {upcomingElections.map((election) => {
            const { registrationDeadline, resultDate } =
              calculateDates(election);

            const candidates = candidatesByElection[election._id] || [];

            return (
              <Card
                key={election._id}
                className="shadow-lg bg-slate-100  dark:bg-slate-900 cursor-default"
              >
                <h2 className="text-2xl font-bold text-center mb-2 capitalize">
                  {election.name}
                </h2>
                <div className="flex items-center mb-0.5 gap-1">
                  <FaCalendarAlt className="mr-2" />
                  <p className="font-medium">Registration Deadline: </p>
                  <p>{registrationDeadline.toLocaleDateString()}</p>
                </div>
                <div className="flex items-center mb-0.5 gap-1">
                  <FaCalendarAlt className="mr-2" />
                  <p className="font-medium">Voting Period:</p>
                  <p>
                    {new Date(election.startDate).toLocaleDateString()} -{" "}
                    {new Date(election.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center text-indigo-800 dark:text-indigo-600">
                  <p className="text-xl font-semibold"> Result Announcement:</p>
                  <div className="text-4xl font-bold">
                    {resultDate.toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 min-h-40">
                  <div className="flex space-x-2 mb-3">
                    <h3 className="text-lg font-semibold">
                      Confirmed Candidates
                    </h3>
                    <FaArrowAltCircleDown className="mt-2 text-green-600" />
                  </div>
                  {candidates.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {candidates.map((candidate) => (
                        <div key={candidate._id} className="flex mb-3">
                          <FaUserCheck className="mr-2 mt-1" />
                          {candidate.name} - ({candidate.partyName})
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p>No candidates available</p>
                  )}
                </div>
                <Button gradientDuoTone="purpleToBlue" className="m-3" outline onClick={()=>toast.info("Yet to be published")}>
                  Know More...
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Pagination,
} from "flowbite-react";
import { MdOutlineFactCheck } from "react-icons/md";
import { toast } from "react-toastify";
import Loader from "../Loader";

export default function VoterElections() {
  const [elections, setElections] = useState([]);
  const [filterType, setFilterType] = useState("live");
  const [electionBar, setElectionBar] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const today = new Date();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/election/getAll");
        const AvailableElections = response.data.filter(
          ({ startDate, endDate }) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return (start <= today && end >= today) || today > end;
          }
        );
        setElections(AvailableElections);
      } catch {
        toast.error("Failed to load elections");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
    setCurrentPage(1);
  }, [filterType]);

  const filteredElections = elections
    .filter((election) => {
      const now = new Date();
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);

      if (filterType === "live") return start <= now && end >= now;
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

   const handleNavigation = (election) => {
     navigate(`/dashboard?tab=elections&electionId=${election._id}`, {
       state: {
         Ename: election.name,
         startDate: election.startDate,
         endDate: election.endDate,
       },
     });
     if (window.innerWidth > 768) {
       window.scrollTo(0, 0);
     }
     setIsCollapsed(true);
   };

    if (loading) {
	   return <Loader />;
	 }

  return (
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
          {["live", "ended"].map((type) => (
            <div
              key={type}
              className={`cursor-pointer font-semibold text-lg sm:text-xl transition-all duration-200 ease-in-out flex-grow py-2 text-center hover:text-violet-950  dark:hover:text-white  $dark:text-violet-100 uppercase  ${
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
        <Table className="shadow-md mt-6 mb-16">
          <Table.Head>
            <Table.HeadCell className="border-r">Name</Table.HeadCell>
            <Table.HeadCell className="border-r">Active Period</Table.HeadCell>
            <Table.HeadCell className="border-r">Candidates</Table.HeadCell>
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
                  onClick={() => handleNavigation(election)}
                >
                  <Table.Cell className="font-semibold text-wrap cursor-pointer">
                    <div className="flex items-center">
                      <span className={`sm:text-[16px]`}>{election.name}</span> 
                      {election.result?.winner && (
                        <MdOutlineFactCheck className="text-green-600 dark:text-green-700 text-xl mt-1 mx-4" />
                      )}
                    </div>
                  </Table.Cell>

                  <Table.Cell className={`md:text-lg font-medium `}>
                    {new Date(election.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                    <br />
                    {new Date(election.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </Table.Cell>

                  <Table.Cell className="text-[19px]">
                    {election.candidates.length}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>

        <div className="flex overflow-x-auto sm:justify-center mb-10">
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
      </div>
    </div>
  );
}

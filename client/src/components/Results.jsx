import { Button, Card, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { BsGraphUpArrow } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import Heading from "./Heading";
import Chart from "react-apexcharts";

export default function Results() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [electionToShow, setElectionToShow] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/election/getAll");
        const resultDeclaredElections = response.data.filter(
          (election) => election.result && election.result.winner
        );
        setElections(resultDeclaredElections);
      } catch (err) {
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);
  

  return (
    <div>
      <Heading heading="results" />

      {elections.length === 0 ? (
        <div className="flex flex-col justify-center items-center m-16 p-10 bg-red-600 dark:bg-inherit bg-opacity-30 cursor-default border border-slate-200 dark:border-teal-600 dark:bg-gray-800 rounded ">
          <HiExclamationCircle className="text-6xl mb-2" />
          <h1 className=" text-lg sm:text-2xl text-center text-nowrap">
            No Results Available
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 cursor-default xl:grid-cols-3 gap-3 p-4 mb-10">
          {elections.map((election) => (
            <Card
              className="shadow-lg bg-slate-100 dark:bg-slate-900 relative"
              key={election._id}
            >
              <h1 className="text-center text-xl sm:text-2xl lg:text-3xl capitalize font-serif text-gray-800 dark:text-white text-nowrap">
                {election.name}
              </h1>
              <img
                src={election.result.winner.partyLogo}
                alt={election.result.winner.name}
                className="rounded-full h-[70px] w-[70px] mx-auto border-slate-900 border-2 dark:border-white mt-6"
                loading="lazy"
              />
              <span className="text-center font-semibold ">
                {election.result.winner.partyName.toLowerCase() ===
                "independent"
                  ? election.result.winner.name
                  : election.result.winner.partyName}
              </span>
              <img src="/podium.png" />
              <div className="absolute top-12 right-0">
                <img src="/stamp.png" className="h-32 w-32 animate-spin" />
                <span className="absolute bottom-[44px] right-2 rotate-[-25deg] font-medium text-xl uppercase bg-red-700 text-white rounded-xl p-1 animate-pulse">
                  {election.result.majority ? "majority" : "plurality"}{" "}
                </span>
              </div>

              <Button
                gradientDuoTone="purpleToBlue"
                outline
                className="ml-2"
                onClick={() => {
                  setShowStatistics(true);
                  setElectionToShow(election);
                }}
              >
                Statistics
              </Button>
            </Card>
          ))}
        </div>
      )}
      {showStatistics && electionToShow && (
        <Modal
          show={showStatistics}
          onClose={() => setShowStatistics(false)}
          position={"center"}
        >
          {/* <Modal.Header>{electionToShow.name}</Modal.Header> */}
          <Modal.Header>
            <div className="flex items-center font-semibold uppercase">
              {electionToShow.name} Statistics{" "}
              <BsGraphUpArrow className="ml-6" />
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="m-4">
              <h1 className="text-lg mb-4 p-3 font-medium italic uppercase bg-gradient-to-r from-red-500 via-blue-400 to-white rounded-br-full">
                Details
              </h1>
              <div className="text-nowrap grid grid-cols-2">
                <p className="font-semibold">Started On</p>
                <p className="ml-6 mb-3 text-blue-600">
                  {new Date(electionToShow?.startDate).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
                <p className="font-semibold">Ended On</p>
                <p className="ml-6 mb-3 text-blue-600">
                  {new Date(electionToShow?.endDate).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
                <p className="font-semibold">Result Declared on</p>
                <p className="ml-6 mb-3 text-blue-600">
                  {new Date(electionToShow?.updatedAt).toLocaleDateString(
                    "en-GB"
                  )}
                  {new Date(electionToShow?.updatedAt) >
                  new Date(
                    new Date(electionToShow?.endDate).setDate(
                      new Date(electionToShow?.endDate).getDate() + 30
                    )
                  ) ? (
                    <span className="capitalize text-red-600 ml-1 text-sm">
                      (delayed)
                    </span>
                  ) : (
                    <span className="capitalize text-blue-600 ml-1 text-sm">
                      (on time)
                    </span>
                  )}
                </p>
                <p className="font-semibold">Total Votes Casted</p>

              </div>
            </div>
            <div className="m-4 ">
              <h1 className="text-lg font-medium mb-4 uppercase italic p-3 bg-gradient-to-r from-red-500 via-blue-400 to-white rounded-br-full">
                Participated Candidates
              </h1>
              {electionToShow.candidates.map((candidate, index) => (
                <div
                  className="text-nowrap grid grid-cols-2"
                  key={candidate._id}
                >
                  <p>
                    {index + 1}.&nbsp; {candidate.name}
                  </p>
                  <p className="ml-6 mb-3 text-blue-600">
                    {candidate.partyName}
                  </p>
                </div>
              ))}
            </div>
            <div className="m-4 ">
              <h1 className="text-lg font-medium p-3 mb-4 italic uppercase bg-gradient-to-r from-red-500 via-blue-400 to-white rounded-br-full">
                Overall Votes distribution
              </h1>
              {electionToShow?.candidates?.length > 0 && (
                <Chart
                  options={{
                    chart: {
                      type: "graph",
                    },
                    labels: electionToShow.candidates.map((c) =>
                      c.partyName.toLowerCase() === "independent"
                        ? c.name
                        : c.partyName
                    ),
                    legend: {
                      position: "bottom",
                    },
                    tooltip: {
                      y: {
                        formatter: (val) => `${val} votes`,
                      },
                    },
                  }}
                  series={electionToShow.candidates.map((c) => c.votes)}
                  type="pie"
                  width="100%"
                  height={350}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="failure"
              onClick={() => setShowStatistics(false)}
              outline
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

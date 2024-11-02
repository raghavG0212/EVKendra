import { Button, Card, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { BsGraphUpArrow } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import Heading from "./Heading";

export default function Results() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [electionToShow, setElectionToShow] = useState([]);
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

     { elections.length === 0 ? (
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
              <span className="text-center font-semibold mt-6">
                {election.result.winner.partyName.toLowerCase() ===
                "independent"
                  ? election.result.winner.name
                  : election.result.winner.partyName}
              </span>
              <img
                src={election.result.winner.partyLogo}
                alt={election.result.winner.name}
                className="rounded-full h-[70px] w-[70px] mx-auto border-slate-900 border-2 dark:border-white"
                loading="lazy"
              />
              <img src="/podium.png" />
              <div className="absolute bottom-6 right-0">
                <img src="/stamp.png" className="h-32 w-32 animate-spin" />
                <span className="absolute bottom-[44px] right-2 rotate-[-25deg] font-medium text-xl uppercase bg-red-700 text-white rounded-xl p-1 animate-pulse">
                  {election.result.majority ? "majority" : "plurality"}{" "}
                </span>
              </div>
              <div className="m-4">
                <h1 className="text-lg font-medium mb-2">
                  Participated Candidates :
                </h1>
                {election.candidates.map((candidate, index) => (
                  <div className="text-nowrap" key={candidate._id}>
                    <p>
                      {index + 1}.&nbsp; {candidate.name}
                    </p>
                    <p className="ml-6 mb-3 text-blue-600">
                      {candidate.partyName}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                gradientDuoTone="purpleToBlue"
                outline
                className="w-[60%] ml-2"
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
      <Modal show={showStatistics} onClose={() => setShowStatistics(false)} position={"center"}>
        {/* <Modal.Header>{electionToShow.name}</Modal.Header> */}
        <Modal.Header>
          <div className="flex items-center font-semibold uppercase">
            {electionToShow.name} Statistics <BsGraphUpArrow className="ml-6"/>
          </div>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={()=>setShowStatistics(false)} outline>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

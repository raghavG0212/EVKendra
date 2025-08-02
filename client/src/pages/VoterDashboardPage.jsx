import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VoterSidebarComp from "../components/voter/VoterSidebarComp";
import VoterElections from "../components/voter/VoterElections";
import VoterProfile from "../components/voter/VoterProfile";
import VotingComp from "../components/voter/VotingComp";

export default function VoterDashboardPage() {
  const location = useLocation();
  const electionId = new URLSearchParams(location.search).get("electionId");
  const [tab, setTab] = useState("elections");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row cursor-default">
      <div className="md:w-60">
        <VoterSidebarComp />
      </div>
      <div className="flex-1 ml-2">
        {electionId ? (
          <VotingComp id={electionId} />
        ) : (
          <>
            {tab === "elections" && <VoterElections />}
            {tab === "profile" && <VoterProfile />}
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminElections from "../components/admin/AdminElections";
import AdminProfile from "../components/admin/AdminProfile";
import AdminVotersManage from "../components/admin/AdminVotersManage";
import Candidates from "../components/admin/Candidates";
import AdminSidebarComp from "../components/admin/AdminSidebarComp";

export default function AdminDashboardPage() {
  const location = useLocation();
  const electionId = new URLSearchParams(location.search).get("electionId");
  const [tab, setTab] = useState("dashboard");

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
        <AdminSidebarComp />
      </div>
      
      <div className="flex-1 ml-2">
        {electionId ? (
          <Candidates electionID={electionId} />
        ) : (
          <>
            {tab === "dashboard" && <AdminDashboard />}
            {tab === "elections" && <AdminElections />}
            {tab === "voter-management" && <AdminVotersManage />}
            {tab === "profile" && <AdminProfile />}
          </>
        )}
      </div>
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { IoExitOutline, IoReturnDownBackOutline } from "react-icons/io5";

export default function VotingSuccessPage() {
  const location = useLocation();
  const electionID = location.state?.eid;
  const [voter, setVoter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

 useEffect(() => {
   const handleFetchVoter = async () => {
     setLoading(true);
     try {
       const response = await axios.get("/api/v1/voter/get-voter", {
         params: { voterID: currentUser.voterID, eid: electionID },
       });
       const voterData = response.data;
       setVoter(voterData);
     } catch (err) {
       toast.error(
         err.response?.data?.message || "Failed to fetch voter details"
       );
     } finally {
       setLoading(false);
     }
   };
   handleFetchVoter();
 }, [currentUser.voterID, electionID]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You logged out successfully")
    navigate("/login");
  };

  if(loading){
    return <Loader/>
  }
  return (
    <div className="flex flex-col sm:flex-row justify-evenly items-center min-h-screen">
      <div className="flex flex-col items-center space-y-10">
        <h1 className="text-4xl mb-5">You Successfully Voted</h1>
        {voter && (
          <Table className="border-2 divide-y">
            <Table.Head>
              <Table.HeadCell className="border-r">Name</Table.HeadCell>
              <Table.HeadCell className="border-r">Party Name</Table.HeadCell>
              <Table.HeadCell>Party Logo</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="border-r">
                  {voter.name || "Not defined"}
                </Table.Cell>
                <Table.Cell className="border-r">
                  {voter.partyName || "Not defined"}
                </Table.Cell>
                <Table.Cell>
                  <div className="ml-3 md:ml-0 880px:ml-3 h-12 w-12 flex justify-center items-center bg-white dark:border-gray-700 rounded-full">
                    <img
                      src={voter.partyLogo || "Not defined"}
                      alt="party-logo"
                      className="h-12 w-12 rounded-full"
                      loading="lazy"
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
        <div className="flex flex-col space-y-5 items-center w-full">
          <Button
            color="failure"
            outline
            onClick={handleLogout}
            className="w-full"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">Logout</span>
              <IoExitOutline className="text-2xl" />
            </div>
          </Button>
          <Link to="/dashboard" className="w-full">
            <Button color="success" outline className="w-full">
              <div className="flex items-center space-x-2">
                <span className="text-xl">Back to Dashboard</span>
                <IoReturnDownBackOutline className="text-2xl" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <img src="/tick.webp" alt="Tick" height="250px" width="250px" />
    </div>
  );
}

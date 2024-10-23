import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "../Loader";

export default function OnlyVoter() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
   if (!currentUser) {
     return <Loader />;
   }
   
  return currentUser && !isAdmin ? <Outlet /> : <Navigate to="/login" />;
}

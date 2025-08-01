import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AboutPage from "./pages/AboutPage";
import VotingSuccessPage from "./pages/VotingSuccessPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/Terms&ConditionsPage";
import AdminLogin from "./pages/AdminLogin";
import VoterProfile from "./components/voter/VoterProfile";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import OnlyVoter from "./components/PrivateRoutes/OnlyVoter";
import OnlyAdmin from "./components/PrivateRoutes/OnlyAdmin";
import Candidates from "./components/admin/Candidates";
import Elections from "./components/voter/Elections";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminElections from "./components/admin/AdminElections";

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<AboutPage />} />
        <Route element={<OnlyVoter />}>
          <Route path="/voter-profile" element={<VoterProfile />} />
          <Route path="/election/:id/vote" element={<Elections />} />
          <Route path="/voting-success" element={<VotingSuccessPage />} />
        </Route>
        <Route element={<OnlyAdmin />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route
            path="/election/:id/candidates"
            element={<Candidates />}
          />
          <Route
            path="/election"
            element={<AdminElections />}
          />
        </Route>
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditionsPage />}
        />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

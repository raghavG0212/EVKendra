import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OnlyVoter from "./components/PrivateRoutes/OnlyVoter";
import OnlyAdmin from "./components/PrivateRoutes/OnlyAdmin";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AboutPage from "./pages/AboutPage";
import VotingSuccessPage from "./pages/VotingSuccessPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/Terms&ConditionsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import VoterDashboardPage from "./pages/VoterDashboardPage";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path='/dashboard' element={<VoterDashboardPage/>}/>
          <Route path="/voting-success" element={<VotingSuccessPage />} />
        </Route>
        <Route element={<OnlyAdmin />}>
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
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

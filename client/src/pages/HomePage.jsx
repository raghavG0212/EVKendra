import { useRef, useEffect } from "react";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import UpcomingElections from "../components/UpcomingElections";
import Faqs from "../components/Faqs";
import Results from "../components/Results";
import { Link, useLocation } from "react-router-dom";
import Carousel from "../components/carousel/Carousel";

export default function HomePage() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const location = useLocation();
  const faqsRef = useRef(null);

  useEffect(() => {
   if (location.hash === "#faqs" && faqsRef.current) {
      faqsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  
  return (
    <div className="flex-col mt-20 max-w-[1350px] mx-auto">
      <div className="flex flex-col xl:flex-row justify-between">
        {!currentUser ? (
          <div className="flex flex-col space-y-10 items-center text-center justify-center mt-10 md:mt-0 md:text-5xl text-3xl">
            <h1 className="font-bold uppercase cursor-default">Login To Cast Vote</h1>
            <Link to="/login">
              <Button gradientDuoTone="purpleToPink" outline className="w-52">
                Login As Voter
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button gradientDuoTone="purpleToPink" outline className="w-52">
                Login As Admin
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:ml-10 space-y-10 items-center text-center justify-center mt-10 md:mt-0">
            <div className="flex flex-col cursor-default uppercase">
              <span className="font-bold text-orange-500 md:text-6xl text-5xl mb-3">
                Welcome
              </span>
              <span className="font-bold text-green-600 md:text-5xl text-4xl ">
                {currentUser.name}
              </span>
            </div>
            <Link to={isAdmin ? "/admin-dashboard" : "/voter-election-dashboard"}>
              <Button
                gradientDuoTone="purpleToBlue"
                outline
                className="w-52 uppercase font-semibold"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
        <div className="mt-44 xl:mr-48 hidden md:flex justify-center ">
          <Carousel />
        </div>
      </div>
      <div className="mt-20 home-text cursor-default">
        <h1 className="text-center capitalize mb-10 text-5xl md:hidden custom-title text-pretty">
          Cast Your Vote, Make a Difference
        </h1>
      </div>

      <div id="upcoming-elections">
        <UpcomingElections />
      </div>

      <div id="results">
        <Results />
      </div>

      <div id="faqs" ref={faqsRef}>
        <Faqs />
      </div>
      
    </div>
  );
}

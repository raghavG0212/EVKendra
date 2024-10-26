import { Card } from "flowbite-react";
import { FaUserAltSlash, FaUserCheck } from "react-icons/fa";
import Heading from "./Heading";

export default function Faqs() {
  return (
    <div>
      <Heading heading="FAQ'S" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 mb-10 cursor-default">
        <Card
          className="shadow-lg bg-slate-100 capitalize  dark:bg-slate-900"
          horizontal
        >
          <h2 className="text-2xl font-bold text-center mb-10">
            Eligibility for Candidates
          </h2>
          <div className="p-3">
            <div className="flex items-center mb-4">
              <span className="font-semibold mr-2 text-green-500">
                <FaUserCheck />
              </span>
              <p> an Indian citizen.</p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-green-500">
                <FaUserCheck />
              </span>
              <p> at least 35 years old.</p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-green-500">
                <FaUserCheck />
              </span>
              <p> a registered voter in the constituency. </p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-red-500">
                <FaUserAltSlash />
              </span>
              <p className="line-through">
                Holding any office of profit under the Government.
              </p>
            </div>
            <div className="flex items-center mb-8">
              <span className=" font-semibold mr-2 text-red-500">
                <FaUserAltSlash />
              </span>
              <p className="line-through">Have a criminal record.</p>
            </div>
          </div>
        </Card>
        <Card
          className="shadow-lg bg-slate-100 capitalize  dark:bg-slate-900"
          horizontal
        >
          <h2 className="text-2xl font-bold text-center mb-10">
            Eligibility for Voters
          </h2>
          <div className="p-3 mb-4">
            <div className="flex items-center mb-4">
              <span className="font-semibold mr-2 text-green-500">
                <FaUserCheck />
              </span>
              <p> an Indian citizen.</p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-green-500">
                <FaUserCheck />
              </span>
              <p> at least 18 years old.</p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-green-500">
                <FaUserCheck />
              </span>
              <p> registered as a voter in the relevant constituency</p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-red-500">
                <FaUserAltSlash />
              </span>
              <p className="line-through">Convicted of certain offenses.</p>
            </div>
            <div className="flex items-center mb-4">
              <span className=" font-semibold mr-2 text-red-500">
                <FaUserAltSlash />
              </span>
              <p className="line-through">Declared legally incompetent.</p>
            </div>
          </div>
        </Card>
        <Card
          className="shadow-lg text-sm bg-slate-100  dark:bg-slate-900"
          horizontal
        >
          <h2 className="text-2xl font-bold text-center mb-1">
            EVkendra Updates
          </h2>
          <div className="p-2">
            <div className="mb-2">
              <p className="text-lg font-semibold mb-1">
                Update 1: New Voting Procedures
              </p>
              <p>
                New voting procedures have been introduced to streamline the
                process and reduce wait times. Please check the official website
                for detailed instructions.
              </p>
            </div>
            <div className="mb-2">
              <p className="text-lg font-semibold mb-1">
                Update 2: Extended Voting Hours
              </p>
              <p>
                Voting hours have been extended to accommodate more voters.
                Online polling will now be open from 7 AM to 8 PM on election
                day.
              </p>
            </div>
            <div className="mb-2">
              <p className="text-lg font-semibold mb-1">
                Update 3: New Voter ID Req.
              </p>
              <p>
                New voter ID requirements are in place. Ensure you have the
                updated documentation before proceeding.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

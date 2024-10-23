import React, { useState } from "react";
import { Label } from "flowbite-react";
import VoterSideBar from "./VoterSidebar";
import { useSelector } from "react-redux";
import moment from 'moment';
import { IoList } from "react-icons/io5";
import VoterDrawer from "./VoterDrawer";

export default function VoterProfile() {
   const currentUser = useSelector((state) => state.auth.currentUser);
   const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <VoterSideBar />
      <VoterDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow flex-col">
        <div className="flex items-center space-x-2 p-4 mt-1 bg-slate-300 dark:bg-slate-700 md:hidden mb-10">
          <IoList
            className="text-4xl cursor-pointer hover:text-blue-600 transition duration-150 ease-in-out "
            onClick={() => setIsOpen(true)}
          />
          <h1 className="text-2xl">Options</h1>
        </div>
        <div className=" p-3 shadow m-6 sm:m-12 border dark:border-blue-950 rounded-lg">
          <h1 className="text-3xl font-semibold text-center uppercase mb-10">
            Your Profile
          </h1>
          <div className="flex flex-row justify-between sm:justify-around">
            <div>
              <div className="p-4 ">
                <Label className="block mb-2 uppercase text-md">
                  User Name
                </Label>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser ? currentUser.name : "Not defined"}
                </p>
              </div>
              <div className="p-4 ">
                <Label className="block mb-2 uppercase text-md">Voter ID</Label>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser ? currentUser.voterID : "Not defined"}
                </p>
              </div>
              <div className="p-4 ">
                <Label className="block mb-2 uppercase text-md">DOB</Label>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser
                    ? moment(currentUser.dob).format("DD/MM/YYYY")
                    : "Not defined"}
                </p>
              </div>
              <div className="p-4 ">
                <Label className="block mb-2 uppercase text-md">
                  Phone Number
                </Label>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser ? currentUser.phoneNo : "Not defined"}
                </p>
              </div>
            </div>
            <div className="h-52 w-52 mt-16 sm:mt-10 450px:h-64 450px:w-64 sm:h-72 sm:w-72">
              <img src="/voter.webp" alt="admin"></img>
            </div>
          </div>
          <h1 className="flex justify-center p-8 text-gray-500">
            Details cannot be edited
          </h1>
        </div>
      </div>
    </div>
  );
}

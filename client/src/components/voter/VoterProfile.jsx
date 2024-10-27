import React, { useState } from "react";
import { Label, TextInput } from "flowbite-react";
import VoterSideBar from "./VoterSidebar";
import { useSelector } from "react-redux";
import moment from "moment";

export default function VoterProfile() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <VoterSideBar className="h-full md:w-60 " />
      <div className="flex-grow cursor-default mx-6 my-10 p-3 shadow border dark:border-blue-950 rounded-lg flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-center uppercase mt-10">
          Your Profile
        </h1>
        <div className="rounded-full border-2 border-black dark:border-white bg-purple-700 h-[110px] w-[110px] flex items-center justify-center my-7 ">
          <img src="/voter.webp" alt="voter-image" className="h-[88px] w-[88px]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="p-4 min-w-96 space-y-4 text-center">
            <Label className="block mb-2 uppercase text-md">User Name</Label>
            <input
              id="username"
              type="text"
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              disabled
              value={currentUser.name}
            />
          </div>
          <div className="p-4 min-w-96 space-y-4 text-center">
            <Label className="block mb-2 uppercase text-md">Voter ID</Label>
            <input
              id="username"
              type="text"
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              disabled
              value={currentUser.voterID}
            />
          </div>
          <div className="p-4 min-w-96 space-y-4 text-center">
            <Label className="block mb-2 uppercase text-md">DOB</Label>
            {/* moment(currentUser.dob).format("DD/MM/YYYY") */}
            <input
              id="username"
              type="date"
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              disabled
              value={new Date(currentUser.dob).toISOString().split("T")[0]}
            />
          </div>
          <div className="p-4 min-w-96 space-y-4 text-center">
            <Label className="block mb-2 uppercase text-md">Phone Number</Label>
            <input
              id="username"
              type="text"
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              disabled
              value={currentUser.phoneNo}
            />
          </div>
        </div>
        <h1 className="flex justify-center p-8 text-gray-500">
          Details cannot be edited
        </h1>
      </div>
    </div>
  );
}

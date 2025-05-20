import React from "react";
import welcome from "../../assets/club-welcome.png";
import clubmembers from "../../assets/landingicons/clubmembers.png";
import callin from "../../assets/callin.png";
import report from "../../assets/club-report.png";
import clubcallin from "../../assets/club-callin.png";
import profile from "../../assets/profile.png";

const ClubInfo = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-0 sm:space-y-20 space-y-4">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-center gap-y-3">
          <img
            src={clubmembers}
            alt="Club Members Icon"
            className="size-10 object-cover"
          />
          <div className="text-center">
            <h1 className="text-[2.5rem] font-medium text-black tracking-tight">
              Club Members
            </h1>
            <p className="text-sm text-center font-light text-black max-w-xs leading-5">
              Easily manage guest access for your club membership and keep track
              of all visits with ease.
            </p>
          </div>
        </div>
        <div className="bg-[#FAFAFA] max-w-[420px] w-full px-10 pt-10 rounded-lg flex flex-col items-center justify-center gap-y-2.5 mt-8 lg:mt-0">
          <div className="text-center">
            <h1 className="text-xl font-medium text-black tracking-tight">
              Add Guest
            </h1>
            <p className="text-xs text-center font-light text-black max-w-xs leading-5">
              Maintain a secure guest list and add trusted visitors anytime.
            </p>
          </div>
          <img src={welcome} alt="Club Welcome" className="w-full h-auto" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="bg-[#FAFAFA] max-w-[420px] w-full px-10 pt-10 rounded-lg flex flex-col items-center justify-center gap-y-2.5 mt-8 lg:mt-0">
          <div className="text-center">
            <h1 className="text-xl font-medium text-black tracking-tight">
              Day Visitor
            </h1>
            <p className="text-xs text-center font-light text-black max-w-xs leading-5">
              Call in day guests and ensure smooth access to club facilities.
            </p>
          </div>
          <img src={callin} alt="Club Welcome" className="w-full h-auto" />
        </div>
        <div className="bg-[#FAFAFA] max-w-[420px] w-full px-10 pt-10 rounded-lg flex flex-col items-center justify-center gap-y-2.5 mt-8 lg:mt-0">
          <div className="text-center">
            <h1 className="text-xl font-medium text-black tracking-tight">
              Incident Form
            </h1>
            <p className="text-xs text-center font-light text-black max-w-xs leading-5">
              Build genuine relationships with like-minded individuals.
            </p>
          </div>
          <img src={report} alt="Club Welcome" className="w-full h-auto" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center">
        <div className="bg-[#FAFAFA] max-w-[420px] w-full px-10 pt-10 rounded-lg flex flex-col items-center justify-center gap-y-2.5 mt-8 lg:mt-0">
          <div className="text-center">
            <h1 className="text-xl font-medium text-black tracking-tight">
              Manage Members
            </h1>
            <p className="text-xs text-center font-light text-black max-w-xs leading-5">
              Manage and invite secondary members to the app
            </p>
          </div>
          <img src={profile} alt="Club Welcome" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default ClubInfo;

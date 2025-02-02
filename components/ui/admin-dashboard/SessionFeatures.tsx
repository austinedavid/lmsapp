"use client";

import React, { useState } from "react";
import Sessions from "./sessions/Sessions";
import SpecialRequest from "./sessions/SpecialRequest";

// component to switch session types
const SwitchSessionType: React.FC<{
  oneOneOne: boolean;
  handleChange: (value: boolean) => void;
}> = ({ oneOneOne, handleChange }) => {
  return (
    <div className=" flex  w-[300px] border rounded-lg overflow-hidden">
      <button
        onClick={() => handleChange(true)}
        className={` px-3 py-2 flex-1 text-[12px] ${
          oneOneOne && " bg-green-700 text-white font-semibold"
        } `}
      >
        One on one Session
      </button>
      <button
        onClick={() => handleChange(false)}
        className={` px-3 py-2 flex-1 text-[12px] ${
          !oneOneOne && " bg-green-700 text-white font-semibold"
        } `}
      >
        Special Requests
      </button>
    </div>
  );
};
// component to switch merged sessions and unmerged sessions
const SwitchMerge: React.FC<{
  merged: boolean;
  handleSwitch: (value: boolean) => void;
}> = ({ merged, handleSwitch }) => {
  return (
    <div className=" flex  w-[300px] border rounded-lg overflow-hidden">
      <button
        onClick={() => handleSwitch(true)}
        className={` px-3 py-2 flex-1 text-[12px] ${
          merged && " bg-green-700 text-white font-semibold"
        } `}
      >
        merged
      </button>
      <button
        onClick={() => handleSwitch(false)}
        className={` px-3 py-2 flex-1 text-[12px] ${
          !merged && " bg-green-700 text-white font-semibold"
        } `}
      >
        unmerged
      </button>
    </div>
  );
};

const SessionFeatures = () => {
  const [oneOneOne, setOneOneOne] = useState<boolean>(true);
  const [merged, setMerged] = useState<boolean>(false);
  const handleChange = (value: boolean) => {
    return setOneOneOne(value);
  };
  const handleSwitch = (value: boolean) => {
    return setMerged(value);
  };
  return (
    <div className=" flex flex-col gap-2">
      <div className=" flex items-center justify-between max-sm:flex-col">
        <SwitchSessionType oneOneOne={oneOneOne} handleChange={handleChange} />
        <SwitchMerge merged={merged} handleSwitch={handleSwitch} />
      </div>
      {oneOneOne ? (
        <Sessions merged={merged} />
      ) : (
        <SpecialRequest merged={merged} />
      )}
    </div>
  );
};

export default SessionFeatures;

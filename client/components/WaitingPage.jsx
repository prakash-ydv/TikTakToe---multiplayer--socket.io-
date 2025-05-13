import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function WaitingPage() {
  return (
    <div className="flex-col center h-screen gap-5">
      <CircularProgress />
      <h1 className="text-white">Waiting for oppenent to join...</h1>
    </div>
  );
}

export default WaitingPage;

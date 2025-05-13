import React from "react";

function StartPage(props) {
  return (
    <div className="center h-screen gap-5">
      <div className="center">
        <h1 className="text-3xl font-semibold">TIK TAK TOE</h1>
        <span className="text-xs font-mono">MULTIPLAYER</span>
      </div>

      <button
        onClick={props.onClick}
        className="bg-red-500 text-3xl p-4 rounded-2xl font-semibold cursor-pointer"
      >
        START BATTLE
      </button>
    </div>
  );
}

export default StartPage;

import React from "react";

function ScoreBox(props) {
  const { playerSymb, score } = props;
  return (
    <div className="flex gap-5 bg-green-500 p-2 rounded-md text-black">
      <h1 className="font-semibold text-lg">
        Player {playerSymb} : {score}
      </h1>
    </div>
  );
}

export default ScoreBox;

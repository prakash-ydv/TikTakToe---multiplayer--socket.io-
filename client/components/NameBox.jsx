import React from "react";

function NameBox({name}) {
  return (
    <div className="flex font-semibold text-red-500">
      <h1 className="text-xl uppercase">{name}</h1>
    </div>
  );
}

export default NameBox;

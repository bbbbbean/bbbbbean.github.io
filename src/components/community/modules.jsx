import React from "react";

export default function Toolbar() {
  return (
    <div id="toolbar">
      <span className="ql-formats">
        <select className="ql-size">
          {["1px", "2px", "3px"].map((val) => (
            <option value={val} selected={val === "16px"}>
              {val.replace(/[^0-9]/g, "")}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
}

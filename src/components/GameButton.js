import React from "react";

const GameButton = ({ gameName, onPlay }) => {
  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        padding: "20px",
        margin: "20px auto",
        borderRadius: "10px",
        width: "300px",
        textAlign: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2 style={{ color: "#fff" }}>{gameName}</h2>
      <button
        onClick={onPlay}
        style={{
          backgroundColor: "#6200ea",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Play {gameName}
      </button>
    </div>
  );
};

export default GameButton;

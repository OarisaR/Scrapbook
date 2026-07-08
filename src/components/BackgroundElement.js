import React from "react";

export function BackgroundElement({ bgElement, isSelected, onClick }) {
  return (
    <div
      className={`background-element ${bgElement.name} ${isSelected ? "selected" : ""}`}
      style={{
        position: "absolute",
        left: `${bgElement.x}px`,
        top: `${bgElement.y}px`,
        width: `${bgElement.width}px`,
        height: `${bgElement.height}px`,
        pointerEvents: "auto",
        zIndex: bgElement.zIndex,
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={(e) => onClick(e, bgElement.id, "background")}
    >
      <img
        src={
          bgElement.type === "dot"
            ? require("../images/e_dot.png")
            : bgElement.type === "grid"
              ? require("../images/e_grid.png")
              : bgElement.type === "checkered"
                ? require("../images/e_checkered.png")
                : ""
        }
        alt={`${bgElement.type} pattern`}
        style={{
          position: "absolute",
          top: "-65px",
          left: "-355px",
          width: "1200px",
          height: "810px",
          objectFit: "repeat",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
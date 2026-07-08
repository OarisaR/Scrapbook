import React from "react";
import { ElementControls } from "./ElementControls";

export function DoodleElement({
  doodle,
  isSelected,
  getPositionClass,
  onMouseDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`doodle-element ${isSelected ? "selected" : ""} ${
        doodle.isLocked ? "locked" : ""
      } ${getPositionClass(doodle)}`}
      style={{
        left: `${doodle.x}px`,
        top: `${doodle.y}px`,
        width: `${doodle.width}px`,
        height: `${doodle.height}px`,
        transform: `rotate(${doodle.rotation}deg)`,
        zIndex: doodle.zIndex,
        cursor: doodle.isLocked ? "pointer" : "move",
      }}
      onMouseDown={(e) => onMouseDown(e, doodle.id, "doodle")}
    >
      <img
        src={require(`../images/d_${doodle.type}.png`)}
        alt={`${doodle.type} doodle`}
        className="doodle-image"
      />

      {isSelected && !doodle.isLocked && (
        <ElementControls
          itemId={doodle.id}
          itemType="doodle"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
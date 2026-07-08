import React from "react";
import e_tape from "../images/e_tape.png";
import { ElementControls } from "./ElementControls";

export function TapeElement({
  tape,
  isSelected,
  getPositionClass,
  onMouseDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`tape-element ${isSelected ? "selected" : ""} ${
        tape.isLocked ? "locked" : ""
      } ${getPositionClass(tape)}`}
      style={{
        left: `${tape.x}px`,
        top: `${tape.y}px`,
        width: `${tape.width}px`,
        height: `${tape.height}px`,
        transform: `rotate(${tape.rotation}deg)`,
        zIndex: tape.zIndex,
        cursor: tape.isLocked ? "pointer" : "move",
      }}
      onMouseDown={(e) => onMouseDown(e, tape.id, "tape")}
    >
      <img src={e_tape} alt="Tape" className="tape-image" />

      {isSelected && !tape.isLocked && (
        <ElementControls
          itemId={tape.id}
          itemType="tape"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
import React from "react";
import { ElementControls } from "./ElementControls";

export function AlphabetElement({
  alphabet,
  isSelected,
  getPositionClass,
  onMouseDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`alphabet-element ${isSelected ? "selected" : ""} ${
        alphabet.isLocked ? "locked" : ""
      } ${getPositionClass(alphabet)}`}
      style={{
        left: `${alphabet.x}px`,
        top: `${alphabet.y}px`,
        width: `${alphabet.width}px`,
        height: `${alphabet.height}px`,
        transform: `rotate(${alphabet.rotation}deg)`,
        zIndex: alphabet.zIndex,
        cursor: alphabet.isLocked ? "pointer" : "move",
      }}
      onMouseDown={(e) => onMouseDown(e, alphabet.id, "alphabet")}
    >
      <img
        src={require(`../images/${alphabet.number}.png`)}
        alt={`${alphabet.type} alphabet`}
        className="alphabet-image"
      />

      {isSelected && !alphabet.isLocked && (
        <ElementControls
          itemId={alphabet.id}
          itemType="alphabet"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
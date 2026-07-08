import React from "react";
import { ElementControls } from "./ElementControls";

export function PolaroidElement({
  polaroid,
  isSelected,
  getPositionClass,
  onMouseDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`polaroid-element ${isSelected ? "selected" : ""} ${
        polaroid.isLocked ? "locked" : ""
      } ${getPositionClass(polaroid)}`}
      style={{
        left: `${polaroid.x}px`,
        top: `${polaroid.y}px`,
        width: `${polaroid.width}px`,
        height: `${polaroid.height}px`,
        transform: `rotate(${polaroid.rotation}deg)`,
        zIndex: polaroid.zIndex,
        cursor: polaroid.isLocked ? "pointer" : "move",
      }}
      onMouseDown={(e) => onMouseDown(e, polaroid.id, "polaroid")}
    >
      <div className="polaroid-container">
        <div className="polaroid-photo">
          <img src={polaroid.uploadedImage} alt="User Upload" className="uploaded-image" />
        </div>
        <div className="polaroid-bottom"></div>
      </div>

      {isSelected && !polaroid.isLocked && (
        <ElementControls
          itemId={polaroid.id}
          itemType="polaroid"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
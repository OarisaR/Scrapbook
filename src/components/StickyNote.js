import React from "react";
import e_note from "../images/e_note.png";
import { ElementControls } from "./ElementControls";

export function StickyNote({
  note,
  isSelected,
  getPositionClass,
  onMouseDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`sticky-note ${isSelected ? "selected" : ""} ${
        note.isLocked ? "locked" : ""
      } ${getPositionClass(note)}`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        transform: `rotate(${note.rotation}deg)`,
        zIndex: note.zIndex,
      }}
      onMouseDown={(e) => onMouseDown(e, note.id, "sticky")}
    >
      <img src={e_note} alt="Sticky Note" className="sticky-note-image" />

      {isSelected && !note.isLocked && (
        <ElementControls
          itemId={note.id}
          itemType="sticky"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
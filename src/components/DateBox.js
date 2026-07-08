import React from "react";
import { ElementControls } from "./ElementControls";

export function DateBox({
  dateBox,
  isSelected,
  highlighterMode,
  getPositionClass,
  onMouseDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`date-box ${isSelected ? "selected" : ""} ${
        dateBox.isLocked ? "locked" : ""
      } ${dateBox.isHighlighted ? "highlighted" : ""} ${
        dateBox.isHighlighting ? "highlighting" : ""
      } ${getPositionClass(dateBox)}`}
      style={{
        left: `${dateBox.x}px`,
        top: `${dateBox.y}px`,
        width: `${dateBox.width}px`,
        height: `${dateBox.height}px`,
        transform: `rotate(${dateBox.rotation}deg)`,
        zIndex: dateBox.zIndex,
        cursor: highlighterMode ? "crosshair" : dateBox.isLocked ? "pointer" : "move",
      }}
      onMouseDown={(e) => onMouseDown(e, dateBox.id, "date")}
    >
      <div
        className="date-box-content"
        style={{
          fontSize: `${dateBox.fontSize}px`,
          color: dateBox.color,
          fontFamily: "Finger Paint, cursive",
          position: "relative",
        }}
      >
        {(dateBox.isHighlighted || dateBox.isHighlighting) && (
          <div
            className="highlight-background"
            style={{ width: `${dateBox.highlightProgress || 100}%` }}
          />
        )}
        <span className="text-content">{dateBox.date}</span>
      </div>

      {isSelected && !dateBox.isLocked && (
        <ElementControls
          itemId={dateBox.id}
          itemType="date"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
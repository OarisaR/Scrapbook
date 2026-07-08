import React from "react";
import { ElementControls } from "./ElementControls";

export function TextBox({
  textBox,
  isSelected,
  isEditing,
  highlighterMode,
  getPositionClass,
  onMouseDown,
  onDoubleClick,
  onTextChange,
  onTextBlur,
  onTextKeyDown,
  onResize,
  onRotate,
  onConfirm,
}) {
  return (
    <div
      className={`text-box ${isSelected ? "selected" : ""} ${
        textBox.isLocked ? "locked" : ""
      } ${textBox.isHighlighted ? "highlighted" : ""} ${
        textBox.isHighlighting ? "highlighting" : ""
      } ${getPositionClass(textBox)}`}
      style={{
        left: `${textBox.x}px`,
        top: `${textBox.y}px`,
        width: `${textBox.width}px`,
        height: `${textBox.height}px`,
        transform: `rotate(${textBox.rotation}deg)`,
        zIndex: textBox.zIndex,
        cursor: highlighterMode ? "crosshair" : textBox.isLocked ? "pointer" : "move",
      }}
      onMouseDown={(e) => onMouseDown(e, textBox.id, "text")}
      onDoubleClick={() => onDoubleClick(textBox.id)}
    >
      {isEditing ? (
        <textarea
          className="text-box-input"
          value={textBox.text}
          onChange={(e) => onTextChange(textBox.id, e.target.value)}
          onBlur={onTextBlur}
          onKeyDown={onTextKeyDown}
          autoFocus
          style={{
            fontSize: `${textBox.fontSize}px`,
            color: textBox.color,
            fontFamily: "Finger Paint, cursive",
          }}
        />
      ) : (
        <div
          className="text-box-content"
          style={{
            fontSize: `${textBox.fontSize}px`,
            color: textBox.color,
            fontFamily: "Finger Paint, cursive",
            position: "relative",
          }}
        >
          {(textBox.isHighlighted || textBox.isHighlighting) && (
            <div
              className="highlight-background"
              style={{ width: `${textBox.highlightProgress || 100}%` }}
            />
          )}
          <span className="text-content">{textBox.text}</span>
        </div>
      )}

      {isSelected && !textBox.isLocked && (
        <ElementControls
          itemId={textBox.id}
          itemType="text"
          onResize={onResize}
          onRotate={onRotate}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
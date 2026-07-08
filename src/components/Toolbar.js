import React from "react";
import { Background } from "../Background";
import { Doodle } from "../Doodle";
import { Alphabet } from "../Alphabet";
import sticky from "../images/stickynote.png";
import bg from "../images/bg.png";
import color from "../images/45.png";
import doodle from "../images/doodle.png";
import highlighter from "../images/highlighter.png";
import date from "../images/date.png";
import polaroid from "../images/polaroid.png";
import tape from "../images/tape.png";
import text from "../images/text.png";
import undo from "../images/undo.png";
import redo from "../images/redo.png";
import trash from "../images/trash.png";

const toolIcons = [
  { name: "sticky", icon: sticky, label: "Sticky Note" },
  { name: "bg", icon: bg, label: "Background" },
  { name: "color", icon: color, label: "Alphabets" },
  { name: "doodle", icon: doodle, label: "Doodle" },
  { name: "highlighter", icon: highlighter, label: "Highlighter" },
  { name: "date", icon: date, label: "Date" },
  { name: "polaroid", icon: polaroid, label: "Polaroid" },
  { name: "tape", icon: tape, label: "Tape" },
  { name: "text", icon: text, label: "Text" },
  { name: "undo", icon: undo, label: "Undo" },
  { name: "redo", icon: redo, label: "Redo" },
  { name: "trash", icon: trash, label: "Trash" },
];

export function Toolbar({
  isOpen,
  onToggleDrawer,
  showBackground,
  showDoodle,
  showAlphabet,
  onBackgroundSelect,
  onBackToMain,
  currentBackground,
  onDoodleSelect,
  onBackFromDoodle,
  onAlphabetSelect,
  onBackFromAlphabet,
  highlighterMode,
  historyIndex,
  historyLength,
  onToolClick,
  playClickSound,
}) {
  return (
    <div className={isOpen ? "open-drawer" : "close-drawer"} onClick={onToggleDrawer}>
      {isOpen && (
        <>
          {showBackground ? (
            <Background
              onBackgroundSelect={onBackgroundSelect}
              onBack={onBackToMain}
              currentBackground={currentBackground}
            />
          ) : showDoodle ? (
            <Doodle onDoodleSelect={onDoodleSelect} onBack={onBackFromDoodle} />
          ) : showAlphabet ? (
            <Alphabet onAlphabetSelect={onAlphabetSelect} onBack={onBackFromAlphabet} />
          ) : (
            <div className="drawer-icons-grid">
              {toolIcons.map((tool) => (
                <div
                  key={tool.name}
                  className={`drawer-icon ${
                    highlighterMode && tool.name === "highlighter" ? "active" : ""
                  } ${
                    (tool.name === "undo" && historyIndex <= 0) ||
                    (tool.name === "redo" && historyIndex >= historyLength - 1)
                      ? "disabled"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onToolClick(tool.name);
                  }}
                  title={tool.label}
                >
                  <img src={tool.icon} alt={tool.label} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
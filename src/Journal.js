import React, { useState, useRef, useEffect } from "react";
import journal1 from "./images/journal1.png";
import notebook from "./images/notebook.png";
import e_note from "./images/e_note.png";
import e_tape from "./images/e_tape.png";
import { Background } from "./Background"; // Import Background component
import { Doodle } from "./Doodle"; // Import Doodle component
import { Alphabet } from "./Alphabet"; // Import Alphabet component
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { audioManager } from "./audioManager";
import clickSound from "./pop.mp3";
// Import all the tool icons
import sticky from "./images/stickynote.png";
import bg from "./images/bg.png";
import color from "./images/45.png";
import doodle from "./images/doodle.png";
import highlighter from "./images/highlighter.png";
import date from "./images/date.png";
import polaroid from "./images/polaroid.png";
import tape from "./images/tape.png";
import text from "./images/text.png";
import undo from "./images/undo.png";
import redo from "./images/redo.png";
import trash from "./images/trash.png";

export function Journal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackground, setShowBackground] = useState(false); // New state for background view
  const [showDoodle, setShowDoodle] = useState(false); // New state for doodle view
  const [showAlphabet, setShowAlphabet] = useState(false); // New state for alphabet view

  const [stickyNotes, setStickyNotes] = useState([]);
  const [textBoxes, setTextBoxes] = useState([]);
  const [dateBoxes, setDateBoxes] = useState([]);
  const [tapeElements, setTapeElements] = useState([]);
  const [polaroidElements, setPolaroidElements] = useState([]); // New state for polaroid elements
  const [doodleElements, setDoodleElements] = useState([]); // New state for doodle elements
  const [alphabetElements, setAlphabetElements] = useState([]); // New state for alphabet elements

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

  const [editingText, setEditingText] = useState(null);
  const [highlighterMode, setHighlighterMode] = useState(false);

  // Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // File input ref for polaroid upload
  const fileInputRef = useRef(null);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [backgroundElements, setBackgroundElements] = useState([]); // Add this for background management

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setShowBackground(false); // Close background view when toggling main drawer
    setShowDoodle(false); // Close doodle view when toggling main drawer
    setShowAlphabet(false); // Close alphabet view when toggling main drawer
  };
  useEffect(() => {
    // Add listener to audio manager
    audioManager.addListener(setIsMusicPlaying);

    // Cleanup
    return () => {
      audioManager.removeListener(setIsMusicPlaying);
    };
  }, []);
  useEffect(() => {
    const currentState = {
      stickyNotes,
      textBoxes,
      dateBoxes,
      tapeElements,
      polaroidElements,
      backgroundElements,
      doodleElements,
      alphabetElements,
      timestamp: Date.now(),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);

    if (newHistory.length > 50) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stickyNotes,
    textBoxes,
    dateBoxes,
    tapeElements,
    polaroidElements,
    backgroundElements,
    doodleElements,
    alphabetElements,
  ]);
  const toggleMusic = () => {
    audioManager.toggle();
  };
  const playClickSound = () => {
    try {
      const audio = new Audio(clickSound);
      audio.volume = 1; // Adjust volume as needed
      audio.play().catch(console.log);
    } catch (error) {
      console.log("Click sound failed:", error);
    }
  };
  // Handle background selection - update this function
  const handleBackgroundSelect = (backgroundName) => {
    console.log(`Selected background: ${backgroundName}`);

    // Check if the SAME background already exists on both pages
    const existingLeftBg = backgroundElements.find(
      (bg) => bg.type === backgroundName && bg.page === "left",
    );
    const existingRightBg = backgroundElements.find(
      (bg) => bg.type === backgroundName && bg.page === "right",
    );

    if (existingLeftBg || existingRightBg) {
      // Remove existing backgrounds of the SAME type (toggle off)
      setBackgroundElements((prev) =>
        prev.filter((bg) => bg.type !== backgroundName),
      );
      setCurrentBackground(null);
    } else {
      // Remove ALL existing backgrounds first, then add new ones
      setBackgroundElements([]); // Clear all backgrounds first

      // Add new backgrounds to both pages
      let leftBackground, rightBackground;

      if (backgroundName === "dot") {
        leftBackground = {
          id: Date.now(),
          name: "leftdot",
          type: backgroundName,
          page: "left",
          x: 285,
          y: 70,
          width: 485,
          height: 600,
          isLocked: false,
          zIndex: 1,
        };
        rightBackground = {
          id: Date.now() + 1,
          name: "rightdot",
          type: backgroundName,
          page: "right",
          x: 840,
          y: 70,
          width: 485,
          height: 600,
          isLocked: false,
          zIndex: 1,
        };
      } else if (backgroundName === "grid") {
        leftBackground = {
          id: Date.now(),
          name: "leftgrid",
          type: backgroundName,
          page: "left",
          x: 285,
          y: 70,
          width: 485,
          height: 600,
          isLocked: false,
          zIndex: 1,
        };
        rightBackground = {
          id: Date.now() + 1,
          name: "rightgrid",
          type: backgroundName,
          page: "right",
          x: 840,
          y: 70,
          width: 485,
          height: 600,
          isLocked: false,
          zIndex: 1,
        };
      } else if (backgroundName === "checkered") {
        leftBackground = {
          id: Date.now(),
          name: "leftcheckered",
          type: backgroundName,
          page: "left",
          x: 285,
          y: 70,
          width: 485,
          height: 600,
          isLocked: false,
          zIndex: 1,
        };
        rightBackground = {
          id: Date.now() + 1,
          name: "rightcheckered",
          type: backgroundName,
          page: "right",
          x: 840,
          y: 70,
          width: 485,
          height: 600,
          isLocked: false,
          zIndex: 1,
        };
      }

      if (leftBackground && rightBackground) {
        setBackgroundElements([leftBackground, rightBackground]);
        setCurrentBackground(backgroundName);
      }
    }
  };

  // Handle back to main drawer
  const handleBackToMain = () => {
    setShowBackground(false);
  };

  // Handle back to main drawer from doodle
  const handleBackFromDoodle = () => {
    setShowDoodle(false);
  };

  // Handle back to main drawer from alphabet
  const handleBackFromAlphabet = () => {
    setShowAlphabet(false);
  };

  // Handle doodle selection
  const handleDoodleSelect = (doodleName) => {
    console.log(`Selected doodle: ${doodleName}`);

    const newDoodle = {
      id: Date.now(),
      type: doodleName,
      x: 400,
      y: 250,
      width: 100,
      height: 100,
      rotation: 0,
      isLocked: false,
      zIndex:
        Math.max(
          ...stickyNotes.map((n) => n.zIndex || 0),
          ...textBoxes.map((t) => t.zIndex || 0),
          ...dateBoxes.map((d) => d.zIndex || 0),
          ...tapeElements.map((t) => t.zIndex || 0),
          ...polaroidElements.map((p) => p.zIndex || 0),
          ...doodleElements.map((d) => d.zIndex || 0), // Include existing doodles
          ...alphabetElements.map((a) => a.zIndex || 0), // Include alphabets
          ...backgroundElements.map((bg) => bg.zIndex || 0),
          1000, // Set a high minimum z-index for doodles
        ) + 1, // Add 1 to ensure it's on top
    };

    setDoodleElements([...doodleElements, newDoodle]);
    setSelectedItem(newDoodle.id);
    setSelectedItemType("doodle");
  };

  // Handle alphabet selection
  const handleAlphabetSelect = (alphabetData) => {
    console.log(`Selected alphabet: ${alphabetData.name}`);

    const newAlphabet = {
      id: Date.now(),
      type: alphabetData.name,
      number: alphabetData.number,
      x: 400,
      y: 250,
      width: 80,
      height: 80,
      rotation: 0,
      isLocked: false,
      zIndex:
        Math.max(
          ...stickyNotes.map((n) => n.zIndex || 0),
          ...textBoxes.map((t) => t.zIndex || 0),
          ...dateBoxes.map((d) => d.zIndex || 0),
          ...tapeElements.map((t) => t.zIndex || 0),
          ...polaroidElements.map((p) => p.zIndex || 0),
          ...doodleElements.map((d) => d.zIndex || 0),
          ...alphabetElements.map((a) => a.zIndex || 0), // Include existing alphabets
          ...backgroundElements.map((bg) => bg.zIndex || 0),
          2000, // Set an even higher minimum z-index for alphabets
        ) + 1, // Add 1 to ensure it's on top
    };

    setAlphabetElements([...alphabetElements, newAlphabet]);
    setSelectedItem(newAlphabet.id);
    setSelectedItemType("alphabet");
  };

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

  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setStickyNotes(previousState.stickyNotes);
      setTextBoxes(previousState.textBoxes);
      setDateBoxes(previousState.dateBoxes);
      setTapeElements(previousState.tapeElements);
      setPolaroidElements(previousState.polaroidElements);
      setBackgroundElements(previousState.backgroundElements || []);
      setDoodleElements(previousState.doodleElements || []);
      setAlphabetElements(previousState.alphabetElements || []); // Add this
      setHistoryIndex(historyIndex - 1);
      setSelectedItem(null);
      setSelectedItemType(null);
      setEditingText(null);
      // Update current background based on background elements
      const activeBg = (previousState.backgroundElements || []).find(
        (bg) =>
          bg.type === "dot" || bg.type === "grid" || bg.type === "checkered",
      );
      setCurrentBackground(activeBg ? activeBg.type : null);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setStickyNotes(nextState.stickyNotes);
      setTextBoxes(nextState.textBoxes);
      setDateBoxes(nextState.dateBoxes);
      setTapeElements(nextState.tapeElements);
      setPolaroidElements(nextState.polaroidElements);
      setBackgroundElements(nextState.backgroundElements || []);
      setDoodleElements(nextState.doodleElements || []);
      setAlphabetElements(nextState.alphabetElements || []); // Add this
      setHistoryIndex(historyIndex + 1);
      setSelectedItem(null);
      setSelectedItemType(null);
      setEditingText(null);
      // Update current background based on background elements
      const activeBg = (nextState.backgroundElements || []).find(
        (bg) =>
          bg.type === "dot" || bg.type === "grid" || bg.type === "checkered",
      );
      setCurrentBackground(activeBg ? activeBg.type : null);
    }
  };

  // Handle file upload for polaroid
  const handlePolaroidUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPolaroid = {
          id: Date.now(),
          x: 300,
          y: 200,
          width: 200,
          height: 240, // Slightly taller for polaroid proportions
          rotation: Math.random() * 20 - 10, // Random slight rotation
          isLocked: false,
          uploadedImage: e.target.result,
          zIndex:
            Math.max(
              ...stickyNotes.map((n) => n.zIndex || 0),
              ...textBoxes.map((t) => t.zIndex || 0),
              ...dateBoxes.map((d) => d.zIndex || 0),
              ...tapeElements.map((t) => t.zIndex || 0),
              ...polaroidElements.map((p) => p.zIndex || 0),
            ) + 1,
        };
        setPolaroidElements([...polaroidElements, newPolaroid]);
        setSelectedItem(newPolaroid.id);
        setSelectedItemType("polaroid");
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    event.target.value = "";
  };

  // Function to get today's date in dd.mm.yyyy format
  const getTodaysDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Function to determine if element is near screen edges
  const getPositionClass = (item) => {
    let classes = [];
    if (item.y < 50) classes.push("near-top");
    if (item.x < 50) classes.push("near-left");
    if (item.x > window.innerWidth - 200) classes.push("near-right");
    return classes.join(" ");
  };

  // Highlighter animation function
  const animateHighlight = (textBoxId) => {
    setTextBoxes((boxes) =>
      boxes.map((box) =>
        box.id === textBoxId
          ? { ...box, isHighlighting: true, highlightProgress: 0 }
          : box,
      ),
    );

    let progress = 0;
    const duration = 1000;
    const interval = 20;
    const increment = (interval / duration) * 100;

    const animationTimer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(animationTimer);

        setTimeout(() => {
          setTextBoxes((boxes) =>
            boxes.map((box) =>
              box.id === textBoxId
                ? {
                    ...box,
                    isHighlighted: true,
                    isHighlighting: false,
                    highlightProgress: 100,
                  }
                : box,
            ),
          );
        }, 100);
      }

      setTextBoxes((boxes) =>
        boxes.map((box) =>
          box.id === textBoxId ? { ...box, highlightProgress: progress } : box,
        ),
      );
    }, interval);
  };

  // Highlighter animation function for date elements
  const animateHighlightDate = (dateBoxId) => {
    setDateBoxes((boxes) =>
      boxes.map((box) =>
        box.id === dateBoxId
          ? {
              ...box,
              isHighlighting: true,
              highlightProgress: 0,
              isHighlighted: false,
            }
          : box,
      ),
    );

    let progress = 0;
    const duration = 1000;
    const interval = 20;
    const increment = (interval / duration) * 100;

    const animationTimer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(animationTimer);

        setTimeout(() => {
          setDateBoxes((boxes) =>
            boxes.map((box) =>
              box.id === dateBoxId
                ? {
                    ...box,
                    isHighlighted: true,
                    isHighlighting: false,
                    highlightProgress: 100,
                  }
                : box,
            ),
          );
        }, 100);
      }

      setDateBoxes((boxes) =>
        boxes.map((box) =>
          box.id === dateBoxId ? { ...box, highlightProgress: progress } : box,
        ),
      );
    }, interval);
  };

  const handleToolClick = (toolName) => {
    if (toolName === "bg") {
      // Show background options instead of main drawer tools
      setShowBackground(true);
      return;
    }

    if (toolName === "doodle") {
      // Show doodle options instead of main drawer tools
      setShowDoodle(true);
      return;
    }

    if (toolName === "color") {
      // Show alphabet options instead of main drawer tools
      setShowAlphabet(true);
      return;
    }

    if (toolName === "sticky") {
      setHighlighterMode(false);
      const newNote = {
        id: Date.now(),
        x: 400,
        y: 250,
        width: 400,
        height: 400,
        rotation: 0,
        isLocked: false,
        zIndex:
          Math.max(
            ...stickyNotes.map((n) => n.zIndex || 0),
            ...textBoxes.map((t) => t.zIndex || 0),
            ...dateBoxes.map((d) => d.zIndex || 0),
            ...tapeElements.map((t) => t.zIndex || 0),
            ...polaroidElements.map((p) => p.zIndex || 0),
            100, // Base z-index for sticky notes
          ) + 1,
      };
      setStickyNotes([...stickyNotes, newNote]);
      setSelectedItem(newNote.id);
      setSelectedItemType("sticky");
    } else if (toolName === "text") {
      setHighlighterMode(false);
      const newTextBox = {
        id: Date.now(),
        x: 450,
        y: 300,
        width: 200,
        height: 80,
        rotation: 0,
        text: "Type here...",
        fontSize: 18,
        baseFontSize: 18,
        color: "#000000ff",
        isLocked: false,
        isHighlighted: false,
        isHighlighting: false,
        highlightProgress: 0,
        zIndex:
          Math.max(
            ...stickyNotes.map((n) => n.zIndex || 0),
            ...textBoxes.map((t) => t.zIndex || 0),
            ...dateBoxes.map((d) => d.zIndex || 0),
            ...tapeElements.map((t) => t.zIndex || 0),
            ...polaroidElements.map((p) => p.zIndex || 0),
            0
        ) + 1,
      };
      setTextBoxes([...textBoxes, newTextBox]);
      setSelectedItem(newTextBox.id);
      setSelectedItemType("text");
      setEditingText(newTextBox.id);
    } else if (toolName === "date") {
      setHighlighterMode(false);
      const newDateBox = {
        id: Date.now(),
        x: 500,
        y: 200,
        width: 180,
        height: 50,
        rotation: 0,
        date: getTodaysDate(),
        fontSize: 20,
        baseFontSize: 20,
        color: "#19344a",
        isLocked: false,
        isHighlighted: false, // Add this
        isHighlighting: false, // Add this
        highlightProgress: 0, // Add this
        zIndex:
          Math.max(
            ...stickyNotes.map((n) => n.zIndex || 0),
            ...textBoxes.map((t) => t.zIndex || 0),
            ...dateBoxes.map((d) => d.zIndex || 0),
            ...tapeElements.map((t) => t.zIndex || 0),
            ...polaroidElements.map((p) => p.zIndex || 0),
            0
          ) + 1,
      };
      setDateBoxes([...dateBoxes, newDateBox]);
      setSelectedItem(newDateBox.id);
      setSelectedItemType("date");
    } else if (toolName === "tape") {
      setHighlighterMode(false);
      const newTape = {
        id: Date.now(),
        x: 350,
        y: 150,
        width: 120,
        height: 60,
        rotation: Math.random() * 30 - 15,
        isLocked: false,
        zIndex:
          Math.max(
            ...stickyNotes.map((n) => n.zIndex || 0),
            ...textBoxes.map((t) => t.zIndex || 0),
            ...dateBoxes.map((d) => d.zIndex || 0),
            ...tapeElements.map((t) => t.zIndex || 0),
            ...polaroidElements.map((p) => p.zIndex || 0),
            0,
          ) + 1,
      };
      setTapeElements([...tapeElements, newTape]);
      setSelectedItem(newTape.id);
      setSelectedItemType("tape");
    } else if (toolName === "polaroid") {
      setHighlighterMode(false);
      // Trigger file input
      fileInputRef.current.click();
    } else if (toolName === "highlighter") {
      setHighlighterMode(!highlighterMode);
      setSelectedItem(null);
      setSelectedItemType(null);
      setEditingText(null);
    } else if (toolName === "undo") {
      handleUndo();
    } else if (toolName === "redo") {
      handleRedo();
    } else if (toolName === "trash") {
      setHighlighterMode(false);
      if (selectedItem && selectedItemType) {
        if (selectedItemType === "sticky") {
          setStickyNotes((notes) => notes.filter((n) => n.id !== selectedItem));
        } else if (selectedItemType === "text") {
          setTextBoxes((boxes) => boxes.filter((b) => b.id !== selectedItem));
        } else if (selectedItemType === "date") {
          setDateBoxes((boxes) => boxes.filter((b) => b.id !== selectedItem));
        } else if (selectedItemType === "tape") {
          setTapeElements((elements) =>
            elements.filter((e) => e.id !== selectedItem),
          );
        } else if (selectedItemType === "polaroid") {
          setPolaroidElements((elements) =>
            elements.filter((e) => e.id !== selectedItem),
          );
        } else if (selectedItemType === "doodle") {
          setDoodleElements((elements) =>
            elements.filter((e) => e.id !== selectedItem),
          );
        } else if (selectedItemType === "alphabet") {
          // Add this
          setAlphabetElements((elements) =>
            elements.filter((e) => e.id !== selectedItem),
          );
        } else if (selectedItemType === "background") {
          // Handle both individual and dual background deletion
          if (selectedItem.includes("-both")) {
            const bgType = selectedItem.replace("-both", "");
            setBackgroundElements((elements) =>
              elements.filter((e) => e.type !== bgType),
            );
          } else {
            setBackgroundElements((elements) =>
              elements.filter((e) => e.id !== selectedItem),
            );
          }
          setCurrentBackground(null);
        }
        setSelectedItem(null);
        setSelectedItemType(null);
        setEditingText(null);
  
      }
    } else {
      setHighlighterMode(false);
      console.log(`${toolName} tool clicked!`);
    }
  };

  // Handle clicking on items - update around line 450
  const handleItemClick = (e, itemId, itemType) => {
    e.stopPropagation();

    // Enable highlighter for both text and date elements
    if (highlighterMode && (itemType === "text" || itemType === "date")) {
      if (itemType === "text") {
        const textBox = textBoxes.find((t) => t.id === itemId);
        if (textBox && !textBox.isHighlighted && !textBox.isHighlighting) {
          animateHighlight(itemId);
          setHighlighterMode(false);
        }
      } else if (itemType === "date") {
        const dateBox = dateBoxes.find((d) => d.id === itemId);
        if (dateBox && !dateBox.isHighlighted && !dateBox.isHighlighting) {
          animateHighlightDate(itemId); // New function for date highlighting
          setHighlighterMode(false);
        }
      }
      return;
    }

    // For background elements, select both if they're the same type
    if (itemType === "background") {
      const clickedBg = backgroundElements.find((bg) => bg.id === itemId);
      if (clickedBg) {
        // Find both left and right backgrounds of the same type
        const sameBgs = backgroundElements.filter(
          (bg) => bg.type === clickedBg.type,
        );
        if (sameBgs.length === 2) {
          // Select both backgrounds by using a special identifier
          setSelectedItem(`${clickedBg.type}-both`);
          setSelectedItemType("background");
          return;
        }
      }
    }

    setSelectedItem(itemId);
    setSelectedItemType(itemType);

    if (itemType === "text" && editingText !== itemId) {
      setEditingText(null);
    }
  };

  // Handle moving items
  const handleItemMouseDown = (e, itemId, itemType) => {
    if (highlighterMode) {
      handleItemClick(e, itemId, itemType);
      return;
    }

    let items;
    if (itemType === "sticky") items = stickyNotes;
    else if (itemType === "text") items = textBoxes;
    else if (itemType === "date") items = dateBoxes;
    else if (itemType === "tape") items = tapeElements;
    else if (itemType === "polaroid") items = polaroidElements;
    else if (itemType === "doodle") items = doodleElements;
    else if (itemType === "alphabet") items = alphabetElements; // Add this

    const item = items.find((i) => i.id === itemId);

    if (item.isLocked) {
      handleItemClick(e, itemId, itemType);
      return;
    }

    if (editingText === itemId) return;

    e.preventDefault();
    setSelectedItem(itemId);
    setSelectedItemType(itemType);

    const startX = e.clientX - item.x;
    const startY = e.clientY - item.y;

    const handleMouseMove = (e) => {
      let setItems;
      if (itemType === "sticky") setItems = setStickyNotes;
      else if (itemType === "text") setItems = setTextBoxes;
      else if (itemType === "date") setItems = setDateBoxes;
      else if (itemType === "tape") setItems = setTapeElements;
      else if (itemType === "polaroid") setItems = setPolaroidElements;
      else if (itemType === "doodle") setItems = setDoodleElements;
      else if (itemType === "alphabet") setItems = setAlphabetElements; // Add this

      setItems((items) =>
        items.map((i) =>
          i.id === itemId
            ? { ...i, x: e.clientX - startX, y: e.clientY - startY }
            : i,
        ),
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
     
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle text editing
  const handleTextDoubleClick = (textId) => {
    if (highlighterMode) return;

    const textBox = textBoxes.find((t) => t.id === textId);
    if (textBox && !textBox.isLocked) {
      setEditingText(textId);
      setSelectedItem(textId);
      setSelectedItemType("text");
    }
  };

  const handleTextChange = (textId, newText) => {
    setTextBoxes((boxes) =>
      boxes.map((box) => (box.id === textId ? { ...box, text: newText } : box)),
    );
  };

  const handleTextBlur = () => {
    setEditingText(null);
  
  };

  const handleTextKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setEditingText(null);
  
    }
  };

  // Handle resizing items
  const handleResize = (itemId, itemType, direction, e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    let items;
    if (itemType === "sticky") items = stickyNotes;
    else if (itemType === "text") items = textBoxes;
    else if (itemType === "date") items = dateBoxes;
    else if (itemType === "tape") items = tapeElements;
    else if (itemType === "polaroid") items = polaroidElements;
    else if (itemType === "doodle") items = doodleElements;
    else if (itemType === "alphabet") items = alphabetElements;

    const item = items.find((i) => i.id === itemId);
    const startWidth = item.width;
    const startHeight = item.height;
    const originalFontSize =
      itemType === "text" || itemType === "date"
        ? item.baseFontSize || item.fontSize
        : null;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let setItems;
      if (itemType === "sticky") setItems = setStickyNotes;
      else if (itemType === "text") setItems = setTextBoxes;
      else if (itemType === "date") setItems = setDateBoxes;
      else if (itemType === "tape") setItems = setTapeElements;
      else if (itemType === "polaroid") setItems = setPolaroidElements;
      else if (itemType === "doodle") setItems = setDoodleElements;
      else if (itemType === "alphabet") setItems = setAlphabetElements;

      setItems((items) =>
        items.map((i) => {
          if (i.id === itemId) {
            let newWidth = startWidth;
            let newHeight = startHeight;

            // For alphabet, maintain aspect ratio
            if (itemType === "alphabet") {
              if (direction.includes("right") || direction.includes("left")) {
                newWidth = direction.includes("right")
                  ? Math.max(30, startWidth + deltaX)
                  : Math.max(30, startWidth - deltaX);
                newHeight = newWidth; // Keep square aspect ratio
              } else {
                newHeight = direction.includes("bottom")
                  ? Math.max(30, startHeight + deltaY)
                  : Math.max(30, startHeight - deltaY);
                newWidth = newHeight; // Keep square aspect ratio
              }
              return { ...i, width: newWidth, height: newHeight };
            }

            // For doodle, maintain aspect ratio
            if (itemType === "doodle") {
              if (direction.includes("right") || direction.includes("left")) {
                newWidth = direction.includes("right")
                  ? Math.max(50, startWidth + deltaX)
                  : Math.max(50, startWidth - deltaX);
                newHeight = newWidth; // Keep square aspect ratio
              } else {
                newHeight = direction.includes("bottom")
                  ? Math.max(50, startHeight + deltaY)
                  : Math.max(50, startHeight - deltaY);
                newWidth = newHeight; // Keep square aspect ratio
              }
              return { ...i, width: newWidth, height: newHeight };
            }

            // General resize logic for other elements
            if (direction.includes("right"))
              newWidth = Math.max(80, startWidth + deltaX);
            if (direction.includes("left"))
              newWidth = Math.max(80, startWidth - deltaX);
            if (direction.includes("bottom"))
              newHeight = Math.max(40, startHeight + deltaY);
            if (direction.includes("top"))
              newHeight = Math.max(40, startHeight - deltaY);

            if (
              (itemType === "text" || itemType === "date") &&
              originalFontSize
            ) {
              const widthRatio = newWidth / startWidth;
              const newFontSize = Math.max(
                10,
                Math.min(36, originalFontSize * widthRatio),
              );
              return {
                ...i,
                width: newWidth,
                height: newHeight,
                fontSize: newFontSize,
                baseFontSize: originalFontSize,
              };
            }

            return { ...i, width: newWidth, height: newHeight };
          }
          return i;
        }),
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle rotation
  const handleRotate = (itemId, itemType, e) => {
    e.stopPropagation();

    let items;
    if (itemType === "sticky") items = stickyNotes;
    else if (itemType === "text") items = textBoxes;
    else if (itemType === "date") items = dateBoxes;
    else if (itemType === "tape") items = tapeElements;
    else if (itemType === "polaroid") items = polaroidElements;
    else if (itemType === "doodle") items = doodleElements;
    else if (itemType === "alphabet") items = alphabetElements; // Add this

    const item = items.find((i) => i.id === itemId);
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const startRotation = item.rotation;

    const handleMouseMove = (e) => {
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);

      let setItems;
      if (itemType === "sticky") setItems = setStickyNotes;
      else if (itemType === "text") setItems = setTextBoxes;
      else if (itemType === "date") setItems = setDateBoxes;
      else if (itemType === "tape") setItems = setTapeElements;
      else if (itemType === "polaroid") setItems = setPolaroidElements;
      else if (itemType === "doodle") setItems = setDoodleElements;
      else if (itemType === "alphabet") setItems = setAlphabetElements; // Add this

      setItems((items) =>
        items.map((i) =>
          i.id === itemId ? { ...i, rotation: startRotation + deltaAngle } : i,
        ),
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Confirm positioning
  const confirmPosition = () => {
    if (selectedItem && selectedItemType) {
      if (selectedItemType === "sticky") {
        setStickyNotes((notes) =>
          notes.map((n) =>
            n.id === selectedItem ? { ...n, isLocked: true } : n,
          ),
        );
      } else if (selectedItemType === "text") {
        setTextBoxes((boxes) =>
          boxes.map((b) =>
            b.id === selectedItem ? { ...b, isLocked: true } : b,
          ),
        );
      } else if (selectedItemType === "date") {
        setDateBoxes((boxes) =>
          boxes.map((b) =>
            b.id === selectedItem ? { ...b, isLocked: true } : b,
          ),
        );
      } else if (selectedItemType === "tape") {
        setTapeElements((elements) =>
          elements.map((e) =>
            e.id === selectedItem ? { ...e, isLocked: true } : e,
          ),
        );
      } else if (selectedItemType === "polaroid") {
        setPolaroidElements((elements) =>
          elements.map((e) =>
            e.id === selectedItem ? { ...e, isLocked: true } : e,
          ),
        );
      } else if (selectedItemType === "doodle") {
        setDoodleElements((elements) =>
          elements.map((e) =>
            e.id === selectedItem ? { ...e, isLocked: true } : e,
          ),
        );
      } else if (selectedItemType === "alphabet") {
        // Add this
        setAlphabetElements((elements) =>
          elements.map((e) =>
            e.id === selectedItem ? { ...e, isLocked: true } : e,
          ),
        );
      }
    }
    setSelectedItem(null);
    setSelectedItemType(null);
    setEditingText(null);
  };

  // Click outside to deselect
  const handleContainerClick = (e) => {
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("main-image") ||
      e.target.classList.contains("notebook-image")
    ) {
      setSelectedItem(null);
      setSelectedItemType(null);
      setEditingText(null);
      setHighlighterMode(false);
    }
  };

  return (
    <div className="image-container" onClick={handleContainerClick}>
      <img src={journal1} className="main-image" alt="Journal" />
      <img src={notebook} className="notebook-image" alt="Notebook" />
      <button
        className="music-toggle-btn"
        onClick={toggleMusic}
        title={isMusicPlaying ? "Mute Music" : "Unmute Music"}
      >
        <i
          className={`fas ${
            isMusicPlaying ? "fa-volume-up" : "fa-volume-mute"
          }`}
        ></i>
      </button>

      {/* Music Attribution */}
      <div className="music-attribution">
        Music by{" "}
        <a
          href="https://pixabay.com/users/chilltapefm-51086477/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=371172"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chilltape FM
        </a>{" "}
        from{" "}
        <a
          href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=371172"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pixabay
        </a>
      </div>

      {/* Hidden file input for polaroid upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePolaroidUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Highlighter Mode Indicator */}
      {highlighterMode && (
        <div className="highlighter-indicator">
          ✏️ Click on text to highlight
        </div>
      )}

      {/* Background Elements - Complete corrected version */}
      {backgroundElements.map((bgElement) => {
        const isBothSelected =
          selectedItem === `${bgElement.type}-both` &&
          selectedItemType === "background";
        const isIndividualSelected =
          selectedItem === bgElement.id && selectedItemType === "background";

        return (
          <div
            key={bgElement.id}
            className={`background-element ${bgElement.name} ${
              isBothSelected || isIndividualSelected ? "selected" : ""
            }`}
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
            onClick={(e) => handleItemClick(e, bgElement.id, "background")}
          >
            {/* Use img tag for all background patterns */}
            <img
              src={
                bgElement.type === "dot"
                  ? require("./images/e_dot.png")
                  : bgElement.type === "grid"
                    ? require("./images/e_grid.png")
                    : bgElement.type === "checkered"
                      ? require("./images/e_checkered.png")
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
      })}

      {/* Sticky Notes */}
      {stickyNotes.map((note) => (
        <div
          key={note.id}
          className={`sticky-note ${
            selectedItem === note.id && selectedItemType === "sticky"
              ? "selected"
              : ""
          } ${note.isLocked ? "locked" : ""} ${getPositionClass(note)}`}
          style={{
            left: `${note.x}px`,
            top: `${note.y}px`,
            width: `${note.width}px`,
            height: `${note.height}px`,
            transform: `rotate(${note.rotation}deg)`,
            zIndex: note.zIndex,
          }}
          onMouseDown={(e) => handleItemMouseDown(e, note.id, "sticky")}
        >
          <img src={e_note} alt="Sticky Note" className="sticky-note-image" />

          {selectedItem === note.id &&
            selectedItemType === "sticky" &&
            !note.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(note.id, "sticky", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(note.id, "sticky", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(note.id, "sticky", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(note.id, "sticky", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(note.id, "sticky", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      {/* Text Boxes */}
      {textBoxes.map((textBox) => (
        <div
          key={textBox.id}
          className={`text-box ${
            selectedItem === textBox.id && selectedItemType === "text"
              ? "selected"
              : ""
          } ${textBox.isLocked ? "locked" : ""} ${
            textBox.isHighlighted ? "highlighted" : ""
          } ${textBox.isHighlighting ? "highlighting" : ""} ${getPositionClass(
            textBox,
          )}`}
          style={{
            left: `${textBox.x}px`,
            top: `${textBox.y}px`,
            width: `${textBox.width}px`,
            height: `${textBox.height}px`,
            transform: `rotate(${textBox.rotation}deg)`,
            zIndex: textBox.zIndex,
            cursor: highlighterMode
              ? "crosshair"
              : textBox.isLocked
                ? "pointer"
                : "move",
          }}
          onMouseDown={(e) => handleItemMouseDown(e, textBox.id, "text")}
          onDoubleClick={() => handleTextDoubleClick(textBox.id)}
        >
          {editingText === textBox.id ? (
            <textarea
              className="text-box-input"
              value={textBox.text}
              onChange={(e) => handleTextChange(textBox.id, e.target.value)}
              onBlur={handleTextBlur}
              onKeyDown={handleTextKeyDown}
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
                  style={{
                    width: `${textBox.highlightProgress || 100}%`,
                  }}
                />
              )}
              <span className="text-content">{textBox.text}</span>
            </div>
          )}

          {selectedItem === textBox.id &&
            selectedItemType === "text" &&
            !textBox.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(textBox.id, "text", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(textBox.id, "text", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(textBox.id, "text", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(textBox.id, "text", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(textBox.id, "text", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      {/* Date Boxes - Updated with highlighting support */}
      {dateBoxes.map((dateBox) => (
        <div
          key={dateBox.id}
          className={`date-box ${
            selectedItem === dateBox.id && selectedItemType === "date"
              ? "selected"
              : ""
          } ${dateBox.isLocked ? "locked" : ""} ${
            dateBox.isHighlighted ? "highlighted" : ""
          } ${dateBox.isHighlighting ? "highlighting" : ""} ${getPositionClass(
            dateBox,
          )}`}
          style={{
            left: `${dateBox.x}px`,
            top: `${dateBox.y}px`,
            width: `${dateBox.width}px`,
            height: `${dateBox.height}px`,
            transform: `rotate(${dateBox.rotation}deg)`,
            zIndex: dateBox.zIndex,
            cursor: highlighterMode
              ? "crosshair"
              : dateBox.isLocked
                ? "pointer"
                : "move", // Add crosshair cursor for highlighter mode
          }}
          onMouseDown={(e) => handleItemMouseDown(e, dateBox.id, "date")}
        >
          <div
            className="date-box-content"
            style={{
              fontSize: `${dateBox.fontSize}px`,
              color: dateBox.color,
              fontFamily: "Finger Paint, cursive",
              position: "relative", // Add relative positioning for highlight background
            }}
          >
            {/* Add highlight background for date boxes */}
            {(dateBox.isHighlighted || dateBox.isHighlighting) && (
              <div
                className="highlight-background"
                style={{
                  width: `${dateBox.highlightProgress || 100}%`,
                }}
              />
            )}
            <span className="text-content">{dateBox.date}</span>
          </div>

          {selectedItem === dateBox.id &&
            selectedItemType === "date" &&
            !dateBox.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(dateBox.id, "date", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(dateBox.id, "date", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(dateBox.id, "date", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(dateBox.id, "date", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(dateBox.id, "date", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      {/* Tape Elements */}
      {tapeElements.map((tape) => (
        <div
          key={tape.id}
          className={`tape-element ${
            selectedItem === tape.id && selectedItemType === "tape"
              ? "selected"
              : ""
          } ${tape.isLocked ? "locked" : ""} ${getPositionClass(tape)}`}
          style={{
            left: `${tape.x}px`,
            top: `${tape.y}px`,
            width: `${tape.width}px`,
            height: `${tape.height}px`,
            transform: `rotate(${tape.rotation}deg)`,
            zIndex: tape.zIndex,
            cursor: tape.isLocked ? "pointer" : "move",
          }}
          onMouseDown={(e) => handleItemMouseDown(e, tape.id, "tape")}
        >
          <img src={e_tape} alt="Tape" className="tape-image" />

          {selectedItem === tape.id &&
            selectedItemType === "tape" &&
            !tape.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(tape.id, "tape", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(tape.id, "tape", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(tape.id, "tape", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(tape.id, "tape", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(tape.id, "tape", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      {/* Polaroid Elements - Updated JSX */}
      {polaroidElements.map((polaroid) => (
        <div
          key={polaroid.id}
          className={`polaroid-element ${
            selectedItem === polaroid.id && selectedItemType === "polaroid"
              ? "selected"
              : ""
          } ${polaroid.isLocked ? "locked" : ""} ${getPositionClass(polaroid)}`}
          style={{
            left: `${polaroid.x}px`,
            top: `${polaroid.y}px`,
            width: `${polaroid.width}px`,
            height: `${polaroid.height}px`,
            transform: `rotate(${polaroid.rotation}deg)`,
            zIndex: polaroid.zIndex,
            cursor: polaroid.isLocked ? "pointer" : "move",
          }}
          onMouseDown={(e) => handleItemMouseDown(e, polaroid.id, "polaroid")}
        >
          <div className="polaroid-container">
            {/* Photo area */}
            <div className="polaroid-photo">
              <img
                src={polaroid.uploadedImage}
                alt="Uploaded Photo"
                className="uploaded-image"
              />
            </div>
            {/* White bottom area for polaroid effect */}
            <div className="polaroid-bottom"></div>
          </div>

          {selectedItem === polaroid.id &&
            selectedItemType === "polaroid" &&
            !polaroid.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(polaroid.id, "polaroid", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(polaroid.id, "polaroid", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(polaroid.id, "polaroid", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(polaroid.id, "polaroid", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(polaroid.id, "polaroid", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      {/* Doodle Elements */}
      {doodleElements.map((doodle) => (
        <div
          key={doodle.id}
          className={`doodle-element ${
            selectedItem === doodle.id && selectedItemType === "doodle"
              ? "selected"
              : ""
          } ${doodle.isLocked ? "locked" : ""} ${getPositionClass(doodle)}`}
          style={{
            left: `${doodle.x}px`,
            top: `${doodle.y}px`,
            width: `${doodle.width}px`,
            height: `${doodle.height}px`,
            transform: `rotate(${doodle.rotation}deg)`,
            zIndex: doodle.zIndex,
            cursor: doodle.isLocked ? "pointer" : "move",
          }}
          onMouseDown={(e) => handleItemMouseDown(e, doodle.id, "doodle")}
        >
          <img
            src={require(`./images/d_${doodle.type}.png`)}
            alt={`${doodle.type} doodle`}
            className="doodle-image"
          />

          {selectedItem === doodle.id &&
            selectedItemType === "doodle" &&
            !doodle.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(doodle.id, "doodle", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(doodle.id, "doodle", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(doodle.id, "doodle", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(doodle.id, "doodle", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(doodle.id, "doodle", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      {/* Alphabet Elements */}
      {alphabetElements.map((alphabet) => (
        <div
          key={alphabet.id}
          className={`alphabet-element ${
            selectedItem === alphabet.id && selectedItemType === "alphabet"
              ? "selected"
              : ""
          } ${alphabet.isLocked ? "locked" : ""} ${getPositionClass(alphabet)}`}
          style={{
            left: `${alphabet.x}px`,
            top: `${alphabet.y}px`,
            width: `${alphabet.width}px`,
            height: `${alphabet.height}px`,
            transform: `rotate(${alphabet.rotation}deg)`,
            zIndex: alphabet.zIndex,
            cursor: alphabet.isLocked ? "pointer" : "move",
          }}
          onMouseDown={(e) => handleItemMouseDown(e, alphabet.id, "alphabet")}
        >
          <img
            src={require(`./images/${alphabet.number}.png`)}
            alt={`${alphabet.type} alphabet`}
            className="alphabet-image"
          />

          {selectedItem === alphabet.id &&
            selectedItemType === "alphabet" &&
            !alphabet.isLocked && (
              <>
                <div
                  className="resize-handle top-left"
                  onMouseDown={(e) =>
                    handleResize(alphabet.id, "alphabet", "top-left", e)
                  }
                ></div>
                <div
                  className="resize-handle top-right"
                  onMouseDown={(e) =>
                    handleResize(alphabet.id, "alphabet", "top-right", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-left"
                  onMouseDown={(e) =>
                    handleResize(alphabet.id, "alphabet", "bottom-left", e)
                  }
                ></div>
                <div
                  className="resize-handle bottom-right"
                  onMouseDown={(e) =>
                    handleResize(alphabet.id, "alphabet", "bottom-right", e)
                  }
                ></div>
                <div
                  className="rotate-handle"
                  onMouseDown={(e) => handleRotate(alphabet.id, "alphabet", e)}
                >
                  ⟲
                </div>
                <div className="confirm-handle" onClick={confirmPosition}>
                  ✓
                </div>
              </>
            )}
        </div>
      ))}

      <div
        className={isOpen ? "open-drawer" : "close-drawer"}
        onClick={toggleDrawer}
      >
        {isOpen && (
          <>
            {showBackground ? (
              <Background
                onBackgroundSelect={handleBackgroundSelect}
                onBack={handleBackToMain}
                currentBackground={currentBackground}
              />
            ) : showDoodle ? (
              <Doodle
                onDoodleSelect={handleDoodleSelect}
                onBack={handleBackFromDoodle}
              />
            ) : showAlphabet ? (
              <Alphabet
                onAlphabetSelect={handleAlphabetSelect}
                onBack={handleBackFromAlphabet}
              />
            ) : (
              <div className="drawer-icons-grid">
                {toolIcons.map((tool, index) => (
                  <div
                    key={tool.name}
                    className={`drawer-icon ${
                      highlighterMode && tool.name === "highlighter"
                        ? "active"
                        : ""
                    } ${
                      (tool.name === "undo" && historyIndex <= 0) ||
                      (tool.name === "redo" &&
                        historyIndex >= history.length - 1)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      handleToolClick(tool.name);
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
    </div>
  );
}

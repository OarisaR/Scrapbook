import React, { useState, useRef, useEffect } from "react";
import journal1 from "./images/journal1.png";
import notebook from "./images/notebook.png";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { audioManager } from "./audioManager";
import clickSound from "./pop.mp3";
import html2canvas from "html2canvas";
import { StickyNote } from "./components/StickyNote";
import { TextBox } from "./components/TextBox";
import { DateBox } from "./components/DateBox";
import { TapeElement } from "./components/TapeElement";
import { PolaroidElement } from "./components/PolaroidElement";
import { DoodleElement } from "./components/DoodleElement";
import { AlphabetElement } from "./components/AlphabetElement";
import { BackgroundElement } from "./components/BackgroundElement";
import { Toolbar } from "./components/Toolbar";
import { getAllPages, savePageToDB, deletePageFromDB } from "./db";
export function Journal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showDoodle, setShowDoodle] = useState(false);
  const [showAlphabet, setShowAlphabet] = useState(false);

  const [stickyNotes, setStickyNotes] = useState([]);
  const [textBoxes, setTextBoxes] = useState([]);
  const [dateBoxes, setDateBoxes] = useState([]);
  const [tapeElements, setTapeElements] = useState([]);
  const [polaroidElements, setPolaroidElements] = useState([]);
  const [doodleElements, setDoodleElements] = useState([]);
  const [alphabetElements, setAlphabetElements] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

  const [editingText, setEditingText] = useState(null);
  const [highlighterMode, setHighlighterMode] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fileInputRef = useRef(null);
  const journalRef = useRef(null); // add this
  const [currentBackground, setCurrentBackground] = useState(null);
  const [backgroundElements, setBackgroundElements] = useState([]);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const isRestoringHistoryRef = useRef(false);
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setShowBackground(false);
    setShowDoodle(false);
    setShowAlphabet(false);
  };

  useEffect(() => {
    if (isRestoringHistoryRef.current) {
      isRestoringHistoryRef.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
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

      setHistory((prevHistory) => {
        setHistoryIndex((prevIndex) => {
          const newHistory = prevHistory.slice(0, prevIndex + 1);
          newHistory.push(currentState);
          if (newHistory.length > 50) newHistory.shift();
          setHistory(newHistory);
          return newHistory.length - 1;
        });
        return prevHistory;
      });
    }, 400); // waits for interaction to pause before saving a snapshot

    return () => clearTimeout(timeoutId);
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
  // In your Journal component, add this useEffect:
useEffect(() => {
  const handleMusicState = (playing) => {
    setIsMusicPlaying(playing);
  };
  
  audioManager.addListener(handleMusicState);
  
  // Also sync initial state in case audio is already playing
  setIsMusicPlaying(audioManager.isPlaying);
  
  return () => {
    audioManager.removeListener(handleMusicState);
  };
}, []);
  const handleDownloadSnapshot = () => {
    // Deselect anything and close the drawer so the snapshot is clean
    setSelectedItem(null);
    setSelectedItemType(null);
    setEditingText(null);
    setIsOpen(false);
    setShowBackground(false);
    setShowDoodle(false);
    setShowAlphabet(false);

    // Wait a tick for the UI to re-render without handles/drawer before capturing
    setTimeout(() => {
      html2canvas(journalRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2, // sharper output
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `my-scrapbook-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }, 150);
  };

  const playClickSound = () => {
    try {
      const audio = new Audio(clickSound);
      audio.volume = 1;
      audio.play().catch(console.log);
    } catch (error) {
      console.log("Click sound failed:", error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const fetchedPages = await getAllPages();
        setPages(fetchedPages);
        setCurrentPageIndex(fetchedPages.length); // opens on a fresh blank page
      } catch (err) {
        console.error("Failed to load saved pages:", err);
      }
    })();
  }, []);
  const handleBackgroundSelect = (backgroundName) => {
    console.log(`Selected background: ${backgroundName}`);

    const existingLeftBg = backgroundElements.find(
      (bg) => bg.type === backgroundName && bg.page === "left",
    );
    const existingRightBg = backgroundElements.find(
      (bg) => bg.type === backgroundName && bg.page === "right",
    );

    if (existingLeftBg || existingRightBg) {
      setBackgroundElements((prev) =>
        prev.filter((bg) => bg.type !== backgroundName),
      );
      setCurrentBackground(null);
    } else {
      setBackgroundElements([]);

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

  const handleBackToMain = () => {
    setShowBackground(false);
  };

  const handleBackFromDoodle = () => {
    setShowDoodle(false);
  };

  const handleBackFromAlphabet = () => {
    setShowAlphabet(false);
  };

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
          ...doodleElements.map((d) => d.zIndex || 0),
          ...alphabetElements.map((a) => a.zIndex || 0),
          ...backgroundElements.map((bg) => bg.zIndex || 0),
          1000,
        ) + 1,
    };

    setDoodleElements([...doodleElements, newDoodle]);
    setSelectedItem(newDoodle.id);
    setSelectedItemType("doodle");
  };

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
          ...alphabetElements.map((a) => a.zIndex || 0),
          ...backgroundElements.map((bg) => bg.zIndex || 0),
          2000,
        ) + 1,
    };

    setAlphabetElements([...alphabetElements, newAlphabet]);
    setSelectedItem(newAlphabet.id);
    setSelectedItemType("alphabet");
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      isRestoringHistoryRef.current = true;
      setStickyNotes(previousState.stickyNotes);
      setTextBoxes(previousState.textBoxes);
      setDateBoxes(previousState.dateBoxes);
      setTapeElements(previousState.tapeElements);
      setPolaroidElements(previousState.polaroidElements);
      setBackgroundElements(previousState.backgroundElements || []);
      setDoodleElements(previousState.doodleElements || []);
      setAlphabetElements(previousState.alphabetElements || []);
      setHistoryIndex(historyIndex - 1);
      setSelectedItem(null);
      setSelectedItemType(null);
      setEditingText(null);
      const activeBg = (previousState.backgroundElements || []).find(
        (bg) =>
          bg.type === "dot" || bg.type === "grid" || bg.type === "checkered",
      );
      setCurrentBackground(activeBg ? activeBg.type : null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      isRestoringHistoryRef.current = true;
      setStickyNotes(nextState.stickyNotes);
      setTextBoxes(nextState.textBoxes);
      setDateBoxes(nextState.dateBoxes);
      setTapeElements(nextState.tapeElements);
      setPolaroidElements(nextState.polaroidElements);
      setBackgroundElements(nextState.backgroundElements || []);
      setDoodleElements(nextState.doodleElements || []);
      setAlphabetElements(nextState.alphabetElements || []);
      setHistoryIndex(historyIndex + 1);
      setSelectedItem(null);
      setSelectedItemType(null);
      setEditingText(null);
      const activeBg = (nextState.backgroundElements || []).find(
        (bg) =>
          bg.type === "dot" || bg.type === "grid" || bg.type === "checkered",
      );
      setCurrentBackground(activeBg ? activeBg.type : null);
    }
  };

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
          height: 240,
          rotation: Math.random() * 20 - 10,
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
    event.target.value = "";
  };

  const getTodaysDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const blankPageState = () => ({
    stickyNotes: [],
    textBoxes: [],
    dateBoxes: [],
    tapeElements: [],
    polaroidElements: [],
    backgroundElements: [],
    doodleElements: [],
    alphabetElements: [],
    currentBackground: null,
  });

  const applyPageState = (state) => {
    isRestoringHistoryRef.current = true;
    setStickyNotes(state.stickyNotes || []);
    setTextBoxes(state.textBoxes || []);
    setDateBoxes(state.dateBoxes || []);
    setTapeElements(state.tapeElements || []);
    setPolaroidElements(state.polaroidElements || []);
    setBackgroundElements(state.backgroundElements || []);
    setDoodleElements(state.doodleElements || []);
    setAlphabetElements(state.alphabetElements || []);
    setCurrentBackground(state.currentBackground || null);
    setSelectedItem(null);
    setSelectedItemType(null);
    setEditingText(null);
    setHistory([{ ...state, timestamp: Date.now() }]);
    setHistoryIndex(0);
  };

  const handleSavePage = async () => {
    const pageData = {
      id:
        currentPageIndex < pages.length
          ? pages[currentPageIndex].id
          : `page-${Date.now()}`,
      stickyNotes,
      textBoxes,
      dateBoxes,
      tapeElements,
      polaroidElements,
      backgroundElements,
      doodleElements,
      alphabetElements,
      currentBackground,
      savedAt: Date.now(),
    };

    try {
      await savePageToDB(pageData);
      setPages((prevPages) => {
        if (currentPageIndex < prevPages.length) {
          const updated = [...prevPages];
          updated[currentPageIndex] = pageData;
          return updated;
        }
        return [...prevPages, pageData];
      });
    } catch (err) {
      console.error("Failed to save page:", err);
    }
  };
  const handleDeletePage = async () => {
    if (currentPageIndex >= pages.length) return; // nothing to delete on a blank page

    const confirmed = window.confirm("Delete this page? This can't be undone.");
    if (!confirmed) return;

    const pageToDelete = pages[currentPageIndex];

    try {
      await deletePageFromDB(pageToDelete.id);

      const newPages = pages.filter((_, idx) => idx !== currentPageIndex);
      setPages(newPages);

      let newIndex;
      if (newPages.length === 0) {
        newIndex = 0;
        applyPageState(blankPageState());
      } else if (currentPageIndex < newPages.length) {
        newIndex = currentPageIndex;
        applyPageState(newPages[newIndex]);
      } else {
        newIndex = newPages.length - 1;
        applyPageState(newPages[newIndex]);
      }

      setCurrentPageIndex(newIndex);
    } catch (err) {
      console.error("Failed to delete page:", err);
    }
  };
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      applyPageState(pages[prevIndex]);
      setCurrentPageIndex(prevIndex);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length) {
      const nextIndex = currentPageIndex + 1;
      if (nextIndex === pages.length) {
        applyPageState(blankPageState());
      } else {
        applyPageState(pages[nextIndex]);
      }
      setCurrentPageIndex(nextIndex);
    }
  };
  const getPositionClass = (item) => {
    let classes = [];
    if (item.y < 50) classes.push("near-top");
    if (item.x < 50) classes.push("near-left");
    if (item.x > window.innerWidth - 200) classes.push("near-right");
    return classes.join(" ");
  };

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
      setShowBackground(true);
      return;
    }

    if (toolName === "doodle") {
      setShowDoodle(true);
      return;
    }

    if (toolName === "color") {
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
            100,
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
            0,
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
            0,
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
          setAlphabetElements((elements) =>
            elements.filter((e) => e.id !== selectedItem),
          );
        } else if (selectedItemType === "background") {
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

  const handleItemClick = (e, itemId, itemType) => {
    e.stopPropagation();

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
          animateHighlightDate(itemId);
          setHighlighterMode(false);
        }
      }
      return;
    }

    if (itemType === "background") {
      const clickedBg = backgroundElements.find((bg) => bg.id === itemId);
      if (clickedBg) {
        const sameBgs = backgroundElements.filter(
          (bg) => bg.type === clickedBg.type,
        );
        if (sameBgs.length === 2) {
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
    else if (itemType === "alphabet") items = alphabetElements;

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
      else if (itemType === "alphabet") setItems = setAlphabetElements;

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

            if (itemType === "alphabet") {
              if (direction.includes("right") || direction.includes("left")) {
                newWidth = direction.includes("right")
                  ? Math.max(30, startWidth + deltaX)
                  : Math.max(30, startWidth - deltaX);
                newHeight = newWidth;
              } else {
                newHeight = direction.includes("bottom")
                  ? Math.max(30, startHeight + deltaY)
                  : Math.max(30, startHeight - deltaY);
                newWidth = newHeight;
              }
              return { ...i, width: newWidth, height: newHeight };
            }

            if (itemType === "doodle") {
              if (direction.includes("right") || direction.includes("left")) {
                newWidth = direction.includes("right")
                  ? Math.max(50, startWidth + deltaX)
                  : Math.max(50, startWidth - deltaX);
                newHeight = newWidth;
              } else {
                newHeight = direction.includes("bottom")
                  ? Math.max(50, startHeight + deltaY)
                  : Math.max(50, startHeight - deltaY);
                newWidth = newHeight;
              }
              return { ...i, width: newWidth, height: newHeight };
            }

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

  const handleRotate = (itemId, itemType, e) => {
    e.stopPropagation();

    let items;
    if (itemType === "sticky") items = stickyNotes;
    else if (itemType === "text") items = textBoxes;
    else if (itemType === "date") items = dateBoxes;
    else if (itemType === "tape") items = tapeElements;
    else if (itemType === "polaroid") items = polaroidElements;
    else if (itemType === "doodle") items = doodleElements;
    else if (itemType === "alphabet") items = alphabetElements;

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
      else if (itemType === "alphabet") setItems = setAlphabetElements;

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
    <div
      className="image-container"
      ref={journalRef}
      onClick={handleContainerClick}
    >
      <img src={journal1} className="main-image" alt="Journal" />
      <img src={notebook} className="notebook-image" alt="Notebook" />
      <button
        className="music-toggle-btn"
        onClick={toggleMusic}
        title={isMusicPlaying ? "Mute Music" : "Unmute Music"}
      >
        <i
          className={`fas ${isMusicPlaying ? "fa-volume-up" : "fa-volume-mute"}`}
        ></i>
      </button>

      <button
        className="snapshot-btn"
        onClick={handleDownloadSnapshot}
        title="Download snapshot"
      >
        <i className="fas fa-camera"></i>
      </button>

      <button
        className="save-page-btn"
        onClick={handleSavePage}
        title="Save this page"
      >
        <i className="fas fa-save"></i>
      </button>
      <button
        className="delete-page-btn"
        onClick={handleDeletePage}
        disabled={currentPageIndex >= pages.length}
        title="Delete this page"
      >
        <i className="fas fa-trash"></i>
      </button>
      <div className="page-nav">
        <button
          className="page-nav-btn"
          onClick={handlePreviousPage}
          disabled={currentPageIndex <= 0}
          title="Previous page"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <span className="page-nav-label">
          {currentPageIndex + 1} / {pages.length + 1}
        </span>
        <button
          className="page-nav-btn"
          onClick={handleNextPage}
          disabled={currentPageIndex >= pages.length}
          title="Next page"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePolaroidUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {highlighterMode && (
        <div className="highlighter-indicator">
          ✏️ Click on text to highlight
        </div>
      )}

      {backgroundElements.map((bgElement) => {
        const isBothSelected =
          selectedItem === `${bgElement.type}-both` &&
          selectedItemType === "background";
        const isIndividualSelected =
          selectedItem === bgElement.id && selectedItemType === "background";

        return (
          <BackgroundElement
            key={bgElement.id}
            bgElement={bgElement}
            isSelected={isBothSelected || isIndividualSelected}
            onClick={handleItemClick}
          />
        );
      })}

      {stickyNotes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          isSelected={selectedItem === note.id && selectedItemType === "sticky"}
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      {textBoxes.map((textBox) => (
        <TextBox
          key={textBox.id}
          textBox={textBox}
          isSelected={
            selectedItem === textBox.id && selectedItemType === "text"
          }
          isEditing={editingText === textBox.id}
          highlighterMode={highlighterMode}
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onDoubleClick={handleTextDoubleClick}
          onTextChange={handleTextChange}
          onTextBlur={handleTextBlur}
          onTextKeyDown={handleTextKeyDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      {dateBoxes.map((dateBox) => (
        <DateBox
          key={dateBox.id}
          dateBox={dateBox}
          isSelected={
            selectedItem === dateBox.id && selectedItemType === "date"
          }
          highlighterMode={highlighterMode}
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      {tapeElements.map((tape) => (
        <TapeElement
          key={tape.id}
          tape={tape}
          isSelected={selectedItem === tape.id && selectedItemType === "tape"}
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      {polaroidElements.map((polaroid) => (
        <PolaroidElement
          key={polaroid.id}
          polaroid={polaroid}
          isSelected={
            selectedItem === polaroid.id && selectedItemType === "polaroid"
          }
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      {doodleElements.map((doodle) => (
        <DoodleElement
          key={doodle.id}
          doodle={doodle}
          isSelected={
            selectedItem === doodle.id && selectedItemType === "doodle"
          }
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      {alphabetElements.map((alphabet) => (
        <AlphabetElement
          key={alphabet.id}
          alphabet={alphabet}
          isSelected={
            selectedItem === alphabet.id && selectedItemType === "alphabet"
          }
          getPositionClass={getPositionClass}
          onMouseDown={handleItemMouseDown}
          onResize={handleResize}
          onRotate={handleRotate}
          onConfirm={confirmPosition}
        />
      ))}

      <Toolbar
        isOpen={isOpen}
        onToggleDrawer={toggleDrawer}
        showBackground={showBackground}
        showDoodle={showDoodle}
        showAlphabet={showAlphabet}
        onBackgroundSelect={handleBackgroundSelect}
        onBackToMain={handleBackToMain}
        currentBackground={currentBackground}
        onDoodleSelect={handleDoodleSelect}
        onBackFromDoodle={handleBackFromDoodle}
        onAlphabetSelect={handleAlphabetSelect}
        onBackFromAlphabet={handleBackFromAlphabet}
        highlighterMode={highlighterMode}
        historyIndex={historyIndex}
        historyLength={history.length}
        onToolClick={handleToolClick}
        playClickSound={playClickSound}
      />
    </div>
  );
}

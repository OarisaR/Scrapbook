# Scrapbook Journal

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Styling-1572B6?style=flat-square&logo=css3&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-Icons-528DD7?style=flat-square&logo=fontawesome&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

An interactive, browser-based digital scrapbook built with React. Users can personalize a virtual journal by adding and arranging sticky notes, text boxes, dated entries, tape, photo polaroids, doodles, and decorative alphabet stickers on a customizable page background.

**Live demo:** [scrapbook-drab.vercel.app](https://scrapbook-drab.vercel.app/)

## Features

- **Drag-and-drop canvas** — Freely position, resize, and rotate every element placed on the page.
- **Element types**
  - Sticky notes
  - Text boxes with inline editing and auto-scaling font size
  - Date stamps (auto-filled with the current date)
  - Decorative tape
  - Photo polaroids (via local image upload)
  - Doodle stickers
  - Decorative alphabet letters
- **Backgrounds** — Toggle between dot, grid, and checkered page patterns across both visible pages.
- **Highlighter tool** — Animate a highlight sweep across any text or date element.
- **Undo / Redo** — Full history stack (up to 50 states) covering every element type and background change.
- **Randomized placement** — New elements are placed in open space on the page automatically, avoiding overlap with existing content where possible.
- **Background music** — Toggleable ambient audio with a persisted mute preference and attribution to the original creator.
- **Click sound feedback** — Subtle audio cue on tool interactions.
- **Responsive locking** — Elements can be locked in place once positioned to prevent accidental edits.

## Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React (functional components, hooks) |
| Routing | React Router (`Home` → `Journal`) |
| Icons | Font Awesome |
| Styling | CSS custom properties, hand-drawn scrapbook theme |
| Typography | Google Fonts — Finger Paint |
| Hosting | Vercel |

## Project Structure

```
src/
├── App.js               # Route definitions
├── Home.js               # Landing page with music toggle
├── Journal.js             # Main scrapbook canvas and tool logic
├── Background.js           # Background pattern selector
├── Doodle.js              # Doodle sticker selector
├── Alphabet.js             # Alphabet sticker selector
├── audioManager.js          # Singleton audio playback and mute-state manager
├── App.css               # Global styles and theming
└── images/               # Icons, stickers, and decorative assets
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### Running Locally

```bash
npm start
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This generates an optimized build in the `build/` directory, ready for static hosting.

## Attribution

Background music: [Chilltape FM](https://pixabay.com/users/chilltapefm-51086477/) via [Pixabay](https://pixabay.com/).

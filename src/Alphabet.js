import React from 'react';
import './App.css';
import clickSound from './pop.mp3';

// Import alphabet option images - 26 letters (45.png - 70.png)
const alphabetOptions = [];
for (let i = 45; i <= 70; i++) {
    const letterIndex = i - 45; // 0-25 for A-Z
    const letter = String.fromCharCode(65 + letterIndex); // A-Z
    alphabetOptions.push({
        name: letter.toLowerCase(),
        number: i,
        label: `Letter ${letter}`
    });
}

export function Alphabet({ onBack, onAlphabetSelect }) {
    const playClickSound = () => {
        try {
            const audio = new Audio(clickSound);
            audio.volume = 0.5;
            audio.play().catch(console.log);
        } catch (error) {
            console.log('Click sound failed:', error);
        }
    };

    const handleAlphabetClick = (alphabetData, e) => {
        e.stopPropagation(); // Prevent event bubbling
        playClickSound(); // Add this line
        onAlphabetSelect(alphabetData);
        // Don't call onBack() - this keeps the drawer open
    };

    const handleBackClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        playClickSound(); // Add this line
        onBack();
    };

    return (
        <div className="alphabet-container">
            <div className="alphabet-header">
                <button 
                    className="back-arrow" 
                    onClick={handleBackClick} // Use the new handler
                    title="Back to main"
                >
                    ← Back
                </button>
        
            </div>
            <div className="alphabet-grid">
                {alphabetOptions.map((alphabet) => (
                    <div 
                        key={alphabet.name}
                        className="alphabet-option-icon"
                        onClick={(e) => handleAlphabetClick(alphabet, e)} // Pass event parameter
                        title={alphabet.label}
                    >
                        <img 
                            src={require(`./images/${alphabet.number}.png`)} 
                            alt={alphabet.label} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
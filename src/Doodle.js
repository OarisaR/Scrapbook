import React from 'react';
import './App.css';

// Import doodle option icons - 12 doodles total (6 rows x 2 columns)
import d_flow from './images/d_flow.png';
import d_flower from './images/d_flower.png';
import d_heart from './images/d_heart.png';
import d_heartmsg from './images/d_heartmsg.png';
import d_maple from './images/d_maple.png';
import d_music from './images/d_music.png';
import d_rainbow from './images/d_rainbow.png';
import d_sparkle from './images/d_sparkle.png';
import d_star from './images/d_star.png';
import d_sun from './images/d_sun.png';
import d_swirl from './images/d_swirl.png';
import d_tada from './images/d_tada.png';
import clickSound from './pop.mp3';

const playClickSound = () => {
  try {
    const audio = new Audio(clickSound);
    audio.volume = 1;
    audio.play().catch(console.log);
  } catch (error) {
    console.log('Click sound failed:', error);
  }
};

export function Doodle({ onBack, onDoodleSelect }) {
    const doodleOptions = [
        { name: 'flow', icon: d_flow, label: 'Flow Doodle' },
        { name: 'flower', icon: d_flower, label: 'Flower Doodle' },
        { name: 'heart', icon: d_heart, label: 'Heart Doodle' },
        { name: 'heartmsg', icon: d_heartmsg, label: 'Heart Message Doodle' },
        { name: 'maple', icon: d_maple, label: 'Maple Leaf Doodle' },
        { name: 'music', icon: d_music, label: 'Music Doodle' },
        { name: 'rainbow', icon: d_rainbow, label: 'Rainbow Doodle' },
        { name: 'sparkle', icon: d_sparkle, label: 'Sparkle Doodle' },
        { name: 'star', icon: d_star, label: 'Star Doodle' },
        { name: 'sun', icon: d_sun, label: 'Sun Doodle' },
        { name: 'swirl', icon: d_swirl, label: 'Swirl Doodle' },
        { name: 'tada', icon: d_tada, label: 'Tada Doodle' }
    ];

    const handleDoodleClick = (doodleName, e) => {
        e.stopPropagation();
        onDoodleSelect(doodleName);
        playClickSound();
    };

    const handleBackClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        onBack();
        playClickSound();
    };
    
    return (
        <div className="doodle-container">
            <div className="doodle-header">
                <button 
                    className="back-arrow" 
                    onClick={handleBackClick} // Use the new handler
                    title="Back to main"
                >
                    ← Back
                </button>
            </div>
            <div className="doodle-grid" style={{ marginLeft : "10px" , marginTop : "15px" , gap : "35px"}}>
                {doodleOptions.map((doodle) => (
                    <div 
                        key={doodle.name}
                        className="doodle-option-icon"
                        onClick={(e) => handleDoodleClick(doodle.name, e)}
                        title={doodle.label}
                    >
                        <img src={doodle.icon} alt={doodle.label} />
                    </div>
                ))}
            </div>
        </div>
    );
}
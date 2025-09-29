import React from 'react';
import home from './images/Home.png';
import click from './images/click.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { audioManager } from './audioManager'; // Import audio manager

export function Home(){
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    useEffect(() => {
        // Add listener to audio manager
        audioManager.addListener(setIsMusicPlaying);
        
        // Try to start music
        const startMusic = async () => {
            const success = await audioManager.play();
            if (!success) {
                // Try to play on user interaction
                document.addEventListener('click', playOnInteraction, { once: true });
            }
        };
        
        const playOnInteraction = async () => {
            await audioManager.play();
        };
        
        startMusic();
        
        // Cleanup
        return () => {
            audioManager.removeListener(setIsMusicPlaying);
        };
    }, []);

    const toggleMusic = () => {
        audioManager.toggle();
    };

    const handleClick = () => {
        setIsClicked(true);
        
        // Ensure music is playing when navigating
        if (!isMusicPlaying) {
            audioManager.play();
        }
        
        navigate('/journal');
    };

    return(
        <div className='image-container'>   
            <img src={home} className='main-image' alt="Home"/>
            {!isClicked && <img src={click} className='click-note' alt="Click to start" onClick={handleClick} />}
            
            {/* Music Toggle Button */}
            <button 
                className="music-toggle-btn"
                onClick={toggleMusic}
                title={isMusicPlaying ? "Mute Music" : "Unmute Music"}
            >
                <i className={`fas ${isMusicPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
            </button>
            
            {/* Music Attribution */}
            <div className="music-attribution">
                Music by <a 
                    href="https://pixabay.com/users/chilltapefm-51086477/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=371172"
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Chilltape FM
                </a> from <a 
                    href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=371172"
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Pixabay
                </a>
            </div>
        </div>
    );
}
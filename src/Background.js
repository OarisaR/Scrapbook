import './App.css';

// Import background option icons
import checkered from './images/checkered.png';
import grid from './images/grid.png';
import dot from './images/dot.png';
import clickSound from './pop.mp3';

export function Background({ onBack, onBackgroundSelect, currentBackground }) {
    const backgroundOptions = [
        { name: 'checkered', icon: checkered, label: 'Checkered Pattern' },
        { name: 'grid', icon: grid, label: 'Grid Pattern' },
        { name: 'dot', icon: dot, label: 'Dot Pattern' }
    ];

    const playClickSound = () => {
        try {
            const audio = new Audio(clickSound);
            audio.volume = 0.5;
            audio.play().catch(console.log);
        } catch (error) {
            console.log('Click sound failed:', error);
        }
    };

    const handleBackgroundClick = (backgroundName, e) => {
        e.stopPropagation();
        onBackgroundSelect(backgroundName);
        playClickSound(); // Play sound on background select
    };

    const handleBackClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        onBack();
        playClickSound(); // Play sound on back
    };

    return (
        <div className="background-container">
            <div className="background-header">
                <button 
                    className="back-arrow" 
                    onClick={handleBackClick} // Use the new handler
                    title="Back to main"
                >
                    ← Back
                </button>
            </div>
            <div className="background-options" style={{ marginLeft : "21px" , marginTop : "15px"}}>
                {backgroundOptions.map((bg) => (
                    <div 
                        key={bg.name}
                        className={`background-option-icon ${currentBackground === bg.name ? 'active' : ''}`}
                        onClick={(e) => handleBackgroundClick(bg.name, e)} // Fixed: Pass event parameter
                        title={bg.label}
                    >
                        <img src={bg.icon} alt={bg.label} />
                    </div>
                ))}
            </div>
        </div>
    );
}
import React from 'react';

const MobileControls = ({ onMove }) => {
    // Shared button styles for the base look
    const btnBase = "w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl transition-all duration-200 active:scale-95 touch-manipulation backdrop-blur-sm";

    // Specific styles for active/interaction
    const btnStyle = `${btnBase} bg-black/40 border-neonBlue/50 text-neonBlue shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:bg-neonBlue/10 hover:border-neonBlue hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] active:bg-neonBlue/20`;

    return (
        <div className="grid grid-cols-3 gap-2 mt-8 lg:hidden select-none">
            {/* Top Row */}
            <div className="col-start-2">
                <button
                    className={btnStyle}
                    onClick={() => onMove('UP')}
                    aria-label="Move Up"
                >
                    ▲
                </button>
            </div>

            {/* Middle Row */}
            <div className="col-start-1 row-start-2">
                <button
                    className={btnStyle}
                    onClick={() => onMove('LEFT')}
                    aria-label="Move Left"
                >
                    ◀
                </button>
            </div>

            <div className="col-start-2 row-start-2">
                <button
                    className={btnStyle}
                    onClick={() => onMove('DOWN')}
                    aria-label="Move Down"
                >
                    ▼
                </button>
            </div>

            <div className="col-start-3 row-start-2">
                <button
                    className={btnStyle}
                    onClick={() => onMove('RIGHT')}
                    aria-label="Move Right"
                >
                    ▶
                </button>
            </div>
        </div>
    );
};

export default MobileControls;

let time;

/**
 * This function converts a time value in seconds to a formated string (MM:SS).
 * @param {*} totalSeconds The given time value
 * @returns The string (MM:SS)
 */
export function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// The code below runs when the site has been loaded.
if (typeof document !== "undefined") {
document.addEventListener("DOMContentLoaded", () => {
    let timerSeconds = 0;
    let timerInterval = null;
    let sudokuStarted = false;
    let timerPaused = false;

    time = 0;

    const timerDisplay = document.getElementById("timer-id");
    const pauseButton = document.getElementById("pause-b-id");
    const pauseIconImg = document.getElementById("pause-icon-img");
        const pauseIconPath = "./illustrations/pause.png";
        const resumeIconPath = "./illustrations/resume.png";
    const startButton = document.getElementById("start-sudoku-btn");
    const startOverlay = document.getElementById("sudoku-start-overlay");

    /**
     * This function enables the overlay, that hides the Sudoku puzzle.
     */
    function showOverlay() {
    startOverlay.classList.remove("Hidden");

    if (sudokuStarted) {
        startButton.textContent = "Resume Sudoku";
    } else {
        startButton.textContent = "Start Sudoku";
    }
}
    /**
    * This function disables the overlay, that hides the Sudoku puzzle.
    */
    function hideOverlay() {
        startOverlay.classList.add("Hidden");
    }

    /**
     * This function starts the timer if it is not already running.
     * It also updates the display every second.
     */
    function startTimer() {
        if (timerInterval !== null) return;

        timerInterval = setInterval(() => {
            timerSeconds++;
            time++;
            timerDisplay.textContent = formatTime(timerSeconds);
        }, 1000);
    }

    /**
     * This function pauses the timer and changes the pause button to a resume button.
     */
    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerPaused = true;
        pauseIconImg.src = resumeIconPath;
        pauseIconImg.alt = "Resume";
        showOverlay();
    }

    /**
    * This function pauses the timer and changes the resume button to a pause button.
    */
    function resumeTimer() {
        sudokuStarted = true;
        timerPaused = false;
        pauseIconImg.src = pauseIconPath;
        pauseIconImg.alt = "Pause";
        hideOverlay();
        startTimer();
    }

    // Event listeners for starting, pausing and resuming the timer.
    startButton.addEventListener("click", () => {
        resumeTimer();
    });

    pauseButton.addEventListener("click", () => {
        if (!sudokuStarted) {
            resumeTimer();
            return;
        }

        if (timerPaused) {
            resumeTimer();
        } else {
            pauseTimer();
        }
    });

    // Initialising timer display and overlay.
    timerDisplay.textContent = formatTime(timerSeconds);
    showOverlay();
});
}

/**
* this function returns the time from the timer in seconds
*/
export function getTime() {
    console.log("time", time)
    return time;
}

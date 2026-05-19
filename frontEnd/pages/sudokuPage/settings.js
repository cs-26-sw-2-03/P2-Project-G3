document.addEventListener("DOMContentLoaded", () => {
    const visibleTimerToggle = document.getElementById("visible-timer-toggle");
    const highlightToggle = document.getElementById("highlight-toggle");
    const timerText = document.getElementById("timer-id");
    const autoCandidateToggle = document.getElementById("auto-candidate-toggle");

    let timerVisible = true;
    let highlightVisible = true;
    let autoCandidate = true;

    window.sudokuSettings = {
        visibleTimer: true,
        highlight: true,
        autoCandidate: true
    };

    function setSwitch(toggle, isOn) {
        toggle.classList.remove("active");

        if (isOn) {
            toggle.classList.add("active");
        }
    }

    function applyTimer() {
        timerText.style.visibility = timerVisible ? "visible" : "hidden";
        window.sudokuSettings.visibleTimer = timerVisible;
        setSwitch(visibleTimerToggle, timerVisible);
    }

    function applyHighlight() {
    window.sudokuSettings.highlight = highlightVisible;
    setSwitch(highlightToggle, highlightVisible);

    document.querySelectorAll(".SudokuCell").forEach(cellElement => {
        const sudokuCell = cellElement.sudokuCell;
        if (!sudokuCell) return;

        if (sudokuCell.isTargetCell) {
            cellElement.style.backgroundColor = "#bbd0f5";
        } else {
            cellElement.style.backgroundColor = "#ffffff";
        }
    });
}

    function applyAutoCandidate() {
        window.sudokuSettings.autoCandidate = autoCandidate;

        setSwitch(autoCandidateToggle, autoCandidate);

        console.log(`Auto candidate toggle has been pressed, it is now ${autoCandidate}`);
    }

    visibleTimerToggle.addEventListener("click", (e) => {
        e.preventDefault();
        timerVisible = !timerVisible;
        console.log(`Timer toggle has been pressed, it is now ${timerVisible}`);
        applyTimer();
    });

    highlightToggle.addEventListener("click", (e) => {
        e.preventDefault();
        highlightVisible = !highlightVisible;
        console.log(`Highlight toggle has been pressed, it is now ${highlightVisible}`);
        applyHighlight();
    });

    autoCandidateToggle.addEventListener("click", (e) => {
        e.preventDefault();

        autoCandidate = !autoCandidate;

        applyAutoCandidate();
    });

    applyTimer();
    applyHighlight();
    applyAutoCandidate();
});
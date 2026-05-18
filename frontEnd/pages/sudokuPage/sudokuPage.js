import { showProficiency } from "./helperfunctions.js";
import { forfeitProficiency } from "./helperfunctions.js";

import { SudokuCell, SudokuBoard } from "./sudokuBoard.js";
import { SudokuRenderer } from "./sudokuRenderer.js";
import { InputController } from "./inputController.js";

const strategies = {
    0: ["Naked Single"],
    1: ["Hidden Single"],
    2: ["Locked Candidates (Pointing Pair / Triple)"],
    3: ["Naked Pair"],
    4: ["Hidden Pair"],
    5: ["Naked Triple", "Hidden Triple"],
    6: ["X-Wing", "Simple Coloring"],
    7: ["XY-Wing", "XYZ-Wing"],
    8: ["W-Wing", "Swordfish"],
    9: ["Alternating Inference Chains (AIC)", "Forcing Chains", "Almost Locked Sets (ALS)"],
    10: ["Sue de Coq", "Jellyfish"]
};

/*------------------------------------ Sudoku board handling ----------------------------------*/

//The sudoku board is initialized as an undefined 9*9 matrix
let sudokuCells = [
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
    ["", , , , , , , , ""],
]

// Backend code for proficiency score calculation and sudoku level selection, not currently used in the frontend but will be used in the future when the backend is connected to the frontend
//const err = 1
//const time = Math.random()*150000

const proficiencyText = document.getElementById("proficiency-score");

async function updateStrategyPopup() {

    if (!proficiencyText) {
        console.error("Missing #proficiency-score in HTML");
        return;
    }

    const data = await showProficiency();
    console.log("data", data)
    if (data === null) {
        console.error("data is null");
        return;
    }

    let numericScore;

    if (typeof data === "number") {
        proficiencyText.textContent = data.toFixed(0);
        numericScore = data;

    } else if (data.score !== undefined) {
        proficiencyText.textContent = Number(data.score).toFixed(0);
        numericScore = Number(data.score);

    } else if (data.proficiency !== undefined) {
        proficiencyText.textContent = Number(data.proficiency).toFixed(0);
        numericScore = Number(data.proficiency);
    } else {
        proficiencyText.textContent = JSON.stringify(data);
    }

    let score = Math.ceil(numericScore);

    let titles = strategies[score] || [];

    const strategyList = document.querySelector(".StrategyList");

    while (strategyList.firstChild) {
        strategyList.removeChild(strategyList.firstChild);
    }

    titles.forEach(title => {
        const p = document.createElement("p");
        p.textContent = title;
        strategyList.appendChild(p);
    })
}

//getProficiency(err, time);

async function getSudokuNumber() {
    const res = await fetch("/api/sudokuLevel");
    const data = await res.json();
    return data.data;
}

let sudokuNumber = await getSudokuNumber();

const { boardData, solvedSudoku } = await loadSudokuBoard(sudokuNumber);

/**
 * This function gets the a Sudoku 2D array from the backend, where the sudokuNumber determines which Sudoku is chosen.
 * @param {*} sudokuNumber The Sudoku 'number'.
 * @returns A Sudoku 2D array, empty cells are null. 
 */
async function loadSudokuBoard(sudokuNumber) {
    const res = await fetch(`/api/sudoku?sudokuNumber=${sudokuNumber}`);
    const data = await res.json();

     return { boardData: data.board, solvedSudoku: data.solvedSudoku }
}

// Inserting each element of the Sudoku 2D array into the object SudokuCell.
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        const value = boardData[i][j];
        sudokuCells[i][j] = new SudokuCell(value, value !== null, i, j);
    }
}
//console.log("solvedSudoku:", solvedSudoku);
// New board based on the cells created above.
const sudokuBoard = new SudokuBoard(sudokuCells, solvedSudoku);
// New renderer
const sudokuRenderer = new SudokuRenderer(sudokuBoard);
// New input controller
const inputController = new InputController(sudokuBoard, sudokuRenderer);

sudokuBoard.inputController = inputController;

sudokuRenderer.setupBoard();
sudokuRenderer.bindCellEvents();
sudokuRenderer.bindNotationEvents();

export function getErr() {
    return sudokuBoard.errorCount;
}

/*--------------------------------- Notation buttons selection --------------------------------*/

// This is the button code, that adds the activeNotation class to the clicked button
const buttons = document.querySelectorAll('#notation-boxes button:not(#forfeit-btn)');

buttons.forEach((button) => {
    button.addEventListener('click', () => {

        // remove active from all
        buttons.forEach((btn) => btn.classList.remove('activeNotation'));

        // add to clicked one
        button.classList.add('activeNotation');

    });
});

/*--------------------------------------- Settings popup --------------------------------------*/

const settingsIcon = document.getElementById("settings-icon");
const settingsPopUp = document.querySelector("#settings-pop-up");
const closeSettingsBtn = document.querySelector("#close-settings-btn");

// Settings PopUp
settingsIcon.addEventListener("click", () => {
    // Close strategy popup first
    strategyPopUp.classList.add("Hidden");

    // Open settings
    settingsPopUp.classList.remove("Hidden");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsPopUp.classList.add("Hidden");
});


// Toggle logic is handled in settings.js — no duplicate listener needed here.

/*--------------------------------------- Strategy popup --------------------------------------*/

const strategyIcon = document.getElementById("strategy-icon");
const strategyPopUp = document.getElementById("strategy-pop-up");
const closeStrategyBtn = document.getElementById("close-strategy-btn");

strategyIcon.addEventListener("click", async () => {
    // Close settings popup first
    settingsPopUp.classList.add("Hidden");

    try {
        await updateStrategyPopup();
    } catch (error) {
        console.error("Strategy popup score update failed:", error);
    }

    // Open strategy
    strategyPopUp.classList.remove("Hidden");
});

closeStrategyBtn.addEventListener("click", () => {
    strategyPopUp.classList.add("Hidden");
});

/*--------------------------------------- Forfeit popup ---------------------------------------*/

const forfeitBtn = document.getElementById("forfeit-btn");
const forfeitPopUp = document.getElementById("forfeit-pop-up");
const confirmForfeitBtn = document.getElementById("confirm-forfeit-btn");
const cancelForfeitBtn = document.getElementById("cancel-forfeit-btn");

forfeitBtn.addEventListener("click", () => {
    settingsPopUp.classList.add("Hidden");
    strategyPopUp.classList.add("Hidden");
    forfeitPopUp.classList.remove("Hidden");
});

// Cancel forfeit and go back to the game
cancelForfeitBtn.addEventListener("click", () => {
    forfeitPopUp.classList.add("Hidden");
});

// Confirm forfeit and go back to start page
confirmForfeitBtn.addEventListener("click", () => {
    // removes one from proficiency score during forfeit.
    forfeitProficiency();
    window.location.href = "/pages/startPage/startPage.html";
});

/*--------------------------------------- Next Sudoku popup -----------------------------------*/

const nextSudokuBtn = document.getElementById("next-sudoku-btn");

nextSudokuBtn.addEventListener("click", () => {
    window.location.reload();
});

const proficiencyScore = await showProficiency();

document.getElementById("boardProficiencyScore").textContent = `Current proficiency: ${proficiencyScore.toFixed(1)}/10`;

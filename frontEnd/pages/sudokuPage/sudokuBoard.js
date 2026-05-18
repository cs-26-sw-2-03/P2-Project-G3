import { findSameNumberInstances } from "./notationHelperFunctions.js";
import { findSameBlockInstances } from "./notationHelperFunctions.js";
import { indexToRowAndColumn } from "./helperfunctions.js";

export class SudokuCell {
    constructor(number, lockedState, rowIndex, columnIndex) {
        this.number = number; // Int, the number in the given cell or "null"
        this.locked = lockedState; // Bool, is this number permanent?
        this.candidateBlock = null;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.isTargetCell = false;
        this.isHighlighted = false;
        this.isSimilarNumber = false;
        this.htmlElement = null;
        this.htmlColourCell = null;
        this.htmlTextElement = null;
        this.cellColour = "#ffffff";
    }
}

export class SudokuBoard {
    constructor(initialCellsArr, solvedSudoku, notationMode = "defaultNotation") {
        this.sudokuCells = initialCellsArr;
        this.inputController = null;
        this.notationMode = notationMode; // Options: "none", "defaultNotation", "cornerNotation", "centerNotation", "colorNotationRed", "colorNotationGreen", "colorNotationBlue"
        this.targetCell = null;
        this.previousTargetCell = null;

        this.solvedSudoku = solvedSudoku;
        this.errorCount = 0;
        this.inFaultyState = false; // if a locked in error exists
        this.hasUnlockedError = false;
        this.unlockedCellError = null; // refers to SudokuCell object in which there is an unlocked error
    }
    /*-------------------------------------- Error tracker ----------------------------------------*/

    lockInError(r, c) {
        if ((!this.hasUnlockedError && !(this.unlockedCellError.rowIndex != r || this.unlockedCellError.columnIndex != c)) || this.inFaultyState) return;
        this.errorCount += 1;
        this.inFaultyState = true;
        this.hasUnlockedError = false;
    }

    errorInCell(r, c) {
        if (this.sudokuCells[r][c].number != this.solvedSudoku[r][c]) return true;
        return false;
    }

    misplacedNumberInBoard() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.sudokuCells[r][c].number) {
                    if (this.errorInCell(r, c)) return true;
                }
            }
        }

        return false;
    }

    clearErrorTrackingProperties() {
        this.inFaultyState = false;
        this.hasUnlockedError = false;
        this.unlockedCellError = null;
    }

    updateErrorState(sudokuCell, number) {
        if (this.hasUnlockedError) {
            if (this.unlockedCellError.rowIndex == sudokuCell.rowIndex && this.unlockedCellError.columnIndex == sudokuCell.columnIndex) {
                if (number == this.solvedSudoku[sudokuCell.rowIndex][sudokuCell.columnIndex]) {
                    this.hasUnlockedError = false;
                    this.unlockedCellError = null;
                }
            } else {
                this.lockInError(this.unlockedCellError.rowIndex, this.unlockedCellError.columnIndex);
            }
        } else {
            if (number != this.solvedSudoku[sudokuCell.rowIndex][sudokuCell.columnIndex]) {
                this.hasUnlockedError = true;
                this.unlockedCellError = sudokuCell;
            }
        }
    }


    /*-------------------------------------- Cell manipulation ------------------------------------*/

    /**
     * This function clears all candidates (corner and center notation) in a given cell.
     * @param {*} sudokuCell The given cell.
     */
    clearCandidates(sudokuCell) {
        sudokuCell.candidateBlock.cornerNotation.topCornerCandidates = [];
        sudokuCell.candidateBlock.cornerNotation.bottomCornerCandidates = [];
        sudokuCell.candidateBlock.centerNotation.centerCandidates = [];
    }

    getHighlightedCandidates(number, sudokuCell) { 
        const highlightedCells = [];

        let columnIndex = sudokuCell.columnIndex;
        let rowIndex = sudokuCell.rowIndex;
        for (let i = 0; i <= 8; i++) {
            highlightedCells.push(this.sudokuCells[i][columnIndex]);
            highlightedCells.push(this.sudokuCells[rowIndex][i]);
        }

        const blockIndices = findSameBlockInstances(rowIndex, columnIndex, this.sudokuCells);

        for (let i = 0; i < blockIndices.length; i++) {
            const { row, column } = indexToRowAndColumn(blockIndices[i]);
            highlightedCells.push(this.sudokuCells[row][column]);
        }
        
        return highlightedCells;
    }

    removeCandidateFromHighlightedCandidateBlocks(highlightedCells, number) {
        highlightedCells.forEach((highlightedCell) => {
            
            if (highlightedCell.candidateBlock && !highlightedCell.locked) {
                this.removeCandidate(number, highlightedCell.candidateBlock);
            }
        })
    }

    removeCandidate(number, candidateBlock) {
        const cornerNotation = candidateBlock.cornerNotation;

        let index = cornerNotation?.topCornerCandidates?.findIndex(
            candidate => candidate == number
        );

        if (index !== undefined && index !== -1) {
            cornerNotation.topCornerCandidates.splice(index, 1);
        }

        index = cornerNotation?.bottomCornerCandidates?.findIndex(
            candidate => candidate == number
        );

        if (index !== undefined && index !== -1) {
            cornerNotation.bottomCornerCandidates.splice(index, 1);
        }

        const centerNotation = candidateBlock.centerNotation;

        index = centerNotation?.centerCandidates?.findIndex(
            candidate => candidate == number
        );

        if (index !== undefined && index !== -1) {
            centerNotation.centerCandidates.splice(index, 1);
        }
    }

    automaticCandidateHandling(number, sudokuCell) {
        const highlightedCells = this.getHighlightedCandidates(number, sudokuCell);
        
        this.removeCandidateFromHighlightedCandidateBlocks(highlightedCells, number);
    }

    /**
     * This function inserts a given number in a given cell, as long as the number is valid and the cell is selected and not locked.
     * @param {*} sudokuCell The given cell.
     * @param {*} number The given number.
     * @returns
     */
    insertCellNumber(sudokuCell, number) {
        if (!sudokuCell.isTargetCell || sudokuCell.locked || !(/^[1-9]$/.test(number))) return;
        if (!this.misplacedNumberInBoard()) this.clearErrorTrackingProperties();
        this.updateErrorState(sudokuCell, number);

        if (window.sudokuSettings.autoCandidate) {
        this.automaticCandidateHandling(number, sudokuCell);
        }
        sudokuCell.number = number;

        console.log("error count:", this.errorCount);

        this.clearSimilarNumberHighlights(sudokuCell.rowIndex, sudokuCell.columnIndex);
        this.highlightSimilarNumbers(sudokuCell.rowIndex, sudokuCell.columnIndex);
    }

    /**
     * This function deletes the number in the given cell, as long as the cell is selected and not locked.
     * It also clears the highlighting of similar numbers.
     * @param {*} sudokuCell The given cell.
     * @returns
     */
    deleteCellNumber(sudokuCell) {
        if (!sudokuCell.isTargetCell || sudokuCell.locked) return;
        this.clearSimilarNumberHighlights(sudokuCell.rowIndex, sudokuCell.columnIndex);
        sudokuCell.number = null;

    }

    setNotationMode(notationMode) {
        this.notationMode = notationMode;
    }

    /**
     * This function changes the color of a cell.
     * @param {*} r The row index of the cell.
     * @param {*} c The column index of the cell.
     * @param {*} color The color the cell needs to be changed to.
     */
    changeCellColour(r, c, color) {
        this.sudokuCells[r][c].cellColour = color;
    }

    /**
     * This function handles cell selection logic when a cell is pressed.
     * It clears previous highlights and sets the selected cell as the target.
     * It then updates row, column, block and similar number highlights,
     * runs the necessary functions when a cell has been pressed
     * and applies color notation if enabled.
     * @param {*} r Row index of the selected cell
     * @param {*} c Column index of the selected cell
     */
    selectCell(r, c) {
        this.clearHighlights();
        this.sudokuCells[r][c].isTargetCell = true;
        this.previousTargetCell = this.targetCell;
        this.targetCell = this.sudokuCells[r][c];
        this.highlightColumn(c);
        this.highlightRow(r);
        this.highlightBlock(r, c);
        this.highlightSimilarNumbers(r, c);
        console.log("notation" + this.notationMode);

        if (this.notationMode.startsWith("colorNotation")) {
            const color = this.notationMode.replace("colorNotation", "").toLowerCase();

            if (this.sudokuCells[r][c].cellColour === color) {
                this.changeCellColour(r, c, null);
            } else {
                this.changeCellColour(r, c, color);
            }
        }
    }

    /*---------------------------------------- Highlighting ---------------------------------------*/

    /**
     * This function clears all highlights related to similar numbers on the board,
     * as well as resetting both similar number and general highlight flags for all cells.
     */
    clearSimilarNumberHighlights() {
        for (let r = 0; r <= 8; r++) {
            for (let c = 0; c <= 8; c++) {
                this.sudokuCells[r][c].isSimilarNumber = false;
                this.sudokuCells[r][c].isHighlighted = false;
            }
        }
    }

    /**
     * This function clears all highlights on the board.
     * It also resets the target cell, similar number and general highlights.
     */
    clearHighlights() {
        for (let r = 0; r <= 8; r++) {
            for (let c = 0; c <= 8; c++) {
                this.sudokuCells[r][c].isHighlighted = false;
                this.sudokuCells[r][c].isSimilarNumber = false;
                this.sudokuCells[r][c].isTargetCell = false;
                this.targetCell = null;
            }
        }
    }

    /**
     * This function highlights the entire column, given a column index.
     * @param {*} c The column index.
     */
    highlightColumn(c) {
        for (let r = 0; r <= 8; r++) {
            this.sudokuCells[r][c].isHighlighted = true;
        }
    }

    /**
     * This function highlights the entire row, given a row index.
     * @param {*} r The row index.
     */
    highlightRow(r) {
        for (let c = 0; c <= 8; c++) {
            this.sudokuCells[r][c].isHighlighted = true;
        }
    }

    /**
     * This function highlights the entire block, given a row and column index pair.
     * @param {*} r The row index.
     * @param {*} c The column index.
     */
    highlightBlock(r, c) {
        const blockIndices = findSameBlockInstances(r, c, this.sudokuCells);

        for (let i = 0; i < blockIndices.length; i++) {
            const { row, column } = indexToRowAndColumn(blockIndices[i]);
            this.sudokuCells[row][column].isHighlighted = true;
        }
    }

    /**
     * This function highlights all cells with the same number as the pressed cell given a row and column index pair.
     * @param {*} r The row index.
     * @param {*} c The column index.
     * @returns
     */
    highlightSimilarNumbers(r, c) {
        if (!this.sudokuCells[r][c].number) return;
        let numberInstances = findSameNumberInstances(r, c, this.sudokuCells);
        for (let i = 0; i < numberInstances.length; i++) {
            let { row, column } = indexToRowAndColumn(numberInstances[i]);
            this.sudokuCells[row][column].isHighlighted = true;
            this.sudokuCells[row][column].isSimilarNumber = true;
        }
    }

    /*--------------------------------------- Miscellaneous ---------------------------------------*/

    /**
     * This function finds a block number given a row and column index pairs.
     * @param {*} rowIndex The row index.
     * @param {*} columnIndex The column index.
     * @returns The block number (0-8).
     */
    getBlockNumber(rowIndex, columnIndex) {
        if (rowIndex <= 2) {
            if (columnIndex <= 2) {
                return 0;
            } else if (columnIndex <= 5) {
                return 1;
            } else if (columnIndex <= 8) {
                return 2;
            }
        } else if (rowIndex <= 5) {
            if (columnIndex <= 2) {
                return 3;
            } else if (columnIndex <= 5) {
                return 4;
            } else if (columnIndex <= 8) {
                return 5;
            }
        } else if (rowIndex <= 8) {
            if (columnIndex <= 2) {
                return 6;
            } else if (columnIndex <= 5) {
                return 7;
            } else if (columnIndex <= 8) {
                return 8;
            }
        }
        return -1;
    }

    /**
     * This function checks if the board is full.
     * @returns True if the board is full, false if not.
     */
    isBoardFull() {
        for (let r = 0; r <= 8; r++) {
            for (let c = 0; c <= 8; c++) {
                if (!this.sudokuCells[r][c].number) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * This function sets the notation mode to the new notation mode.
     * @param {*} notationMode The new notation mode.
     */
    setNotationMode(notationMode) {
        this.notationMode = notationMode;
    }
}

import { describe, it, expect, vi } from "vitest";
import { SudokuBoard } from "../pages/sudokuPage/sudokuBoard.js";

function makeCells(number = null) {
    return Array.from({ length: 9 }, (_, rowIndex) =>
        Array.from({ length: 9 }, (_, columnIndex) => ({
            number,
            locked: false,
            rowIndex,
            columnIndex,
            candidateBlock: {
                cornerNotation: {
                    topCornerCandidates: [1, 2],
                    bottomCornerCandidates: [3, 4],
                },
                centerNotation: {
                    centerCandidates: [5, 6],
                },
            },
            isTargetCell: false,
            isHighlighted: false,
            isSimilarNumber: false,
            cellColour: "#ffffff",
        }))
    );
}

const solvedSudoku = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function makeBoard(number = null) {
    return new SudokuBoard(makeCells(number), solvedSudoku);
}

describe("SudokuBoard insertCellNumber", () => {
    it("inserts a valid number into a selected unlocked cell", () => {
        const board = makeBoard();
        const cell = board.sudokuCells[0][0];
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        cell.isTargetCell = true;

        board.insertCellNumber(cell, "5");

        expect(cell.number).toBe("5");
        logSpy.mockRestore();
    });

    it("does not insert when the cell is not selected", () => {
        const board = makeBoard();
        const cell = board.sudokuCells[0][0];

        board.insertCellNumber(cell, "5");

        expect(cell.number).toBe(null);
    });

    it("does not insert when the cell is locked", () => {
        const board = makeBoard();
        const cell = board.sudokuCells[0][0];

        cell.isTargetCell = true;
        cell.locked = true;

        board.insertCellNumber(cell, "5");

        expect(cell.number).toBe(null);
    });

    it("does not insert invalid numbers", () => {
        const board = makeBoard();
        const cell = board.sudokuCells[0][0];

        cell.isTargetCell = true;

        board.insertCellNumber(cell, "0");
        board.insertCellNumber(cell, "10");
        board.insertCellNumber(cell, "a");

        expect(cell.number).toBe(null);
    });
});

describe("SudokuBoard deleteCellNumber", () => {
    it("deletes a number from a selected unlocked cell", () => {
        const board = makeBoard();
        const cell = board.sudokuCells[0][0];

        cell.number = "5";
        cell.isTargetCell = true;

        board.deleteCellNumber(cell);

        expect(cell.number).toBe(null);
    });

    it("does not delete from an unselected or locked cell", () => {
        const board = makeBoard();
        const unselectedCell = board.sudokuCells[0][0];
        const lockedCell = board.sudokuCells[0][1];

        unselectedCell.number = "5";
        lockedCell.number = "3";
        lockedCell.isTargetCell = true;
        lockedCell.locked = true;

        board.deleteCellNumber(unselectedCell);
        board.deleteCellNumber(lockedCell);

        expect(unselectedCell.number).toBe("5");
        expect(lockedCell.number).toBe("3");
    });
});

describe("SudokuBoard notation and colour", () => {
    it("sets the notation mode", () => {
        const board = makeBoard();

        board.setNotationMode("cornerNotation");

        expect(board.notationMode).toBe("cornerNotation");
    });

    it("changes a cell colour", () => {
        const board = makeBoard();

        board.changeCellColour(1, 2, "red");

        expect(board.sudokuCells[1][2].cellColour).toBe("red");
    });

    it("toggles colour notation when selecting a cell", () => {
        const board = makeBoard();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        board.setNotationMode("colorNotationRed");
        board.selectCell(0, 0);

        expect(board.sudokuCells[0][0].cellColour).toBe("red");

        board.selectCell(0, 0);

        expect(board.sudokuCells[0][0].cellColour).toBe(null);
        logSpy.mockRestore();
    });
});

describe("SudokuBoard selectCell", () => {
    it("sets the target cell and highlights its row, column, and block", () => {
        const board = makeBoard();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        board.selectCell(4, 4);

        expect(board.targetCell).toBe(board.sudokuCells[4][4]);
        expect(board.sudokuCells[4][4].isTargetCell).toBe(true);
        expect(board.sudokuCells[4][0].isHighlighted).toBe(true);
        expect(board.sudokuCells[0][4].isHighlighted).toBe(true);
        expect(board.sudokuCells[3][3].isHighlighted).toBe(true);
        expect(board.sudokuCells[5][5].isHighlighted).toBe(true);
        expect(board.sudokuCells[0][0].isHighlighted).toBe(false);
        logSpy.mockRestore();
    });

    it("clears the previous target cell when selecting a new cell", () => {
        const board = makeBoard();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        board.selectCell(0, 0);
        board.selectCell(1, 1);

        expect(board.sudokuCells[0][0].isTargetCell).toBe(false);
        expect(board.sudokuCells[1][1].isTargetCell).toBe(true);
        logSpy.mockRestore();
    });
});

describe("SudokuBoard highlighting", () => {
    it("clears similar number highlights", () => {
        const board = makeBoard();

        board.sudokuCells[0][0].isSimilarNumber = true;
        board.sudokuCells[0][0].isHighlighted = true;

        board.clearSimilarNumberHighlights();

        expect(board.sudokuCells[0][0].isSimilarNumber).toBe(false);
        expect(board.sudokuCells[0][0].isHighlighted).toBe(false);
    });

    it("clears all highlights and target cells", () => {
        const board = makeBoard();

        board.targetCell = board.sudokuCells[0][0];
        board.sudokuCells[0][0].isTargetCell = true;
        board.sudokuCells[0][0].isSimilarNumber = true;
        board.sudokuCells[0][0].isHighlighted = true;

        board.clearHighlights();

        expect(board.targetCell).toBe(null);
        expect(board.sudokuCells[0][0].isTargetCell).toBe(false);
        expect(board.sudokuCells[0][0].isSimilarNumber).toBe(false);
        expect(board.sudokuCells[0][0].isHighlighted).toBe(false);
    });

    it("highlights a column", () => {
        const board = makeBoard();

        board.highlightColumn(2);

        expect(board.sudokuCells.every((row) => row[2].isHighlighted)).toBe(true);
        expect(board.sudokuCells[0][1].isHighlighted).toBe(false);
    });

    it("highlights a row", () => {
        const board = makeBoard();

        board.highlightRow(2);

        expect(board.sudokuCells[2].every((cell) => cell.isHighlighted)).toBe(true);
        expect(board.sudokuCells[1][0].isHighlighted).toBe(false);
    });

    it("highlights a block", () => {
        const board = makeBoard();

        board.highlightBlock(4, 4);

        expect(board.sudokuCells[3][3].isHighlighted).toBe(true);
        expect(board.sudokuCells[3][4].isHighlighted).toBe(true);
        expect(board.sudokuCells[5][5].isHighlighted).toBe(true);
        expect(board.sudokuCells[2][2].isHighlighted).toBe(false);
    });

    it("highlights cells containing the same number", () => {
        const board = makeBoard();

        board.sudokuCells[0][0].number = "5";
        board.sudokuCells[1][1].number = "5";
        board.sudokuCells[2][2].number = "3";

        board.highlightSimilarNumbers(0, 0);

        expect(board.sudokuCells[0][0].isHighlighted).toBe(true);
        expect(board.sudokuCells[0][0].isSimilarNumber).toBe(true);
        expect(board.sudokuCells[1][1].isHighlighted).toBe(true);
        expect(board.sudokuCells[1][1].isSimilarNumber).toBe(true);
        expect(board.sudokuCells[2][2].isHighlighted).toBe(false);
        expect(board.sudokuCells[2][2].isSimilarNumber).toBe(false);
    });

    it("does not highlight similar numbers when the selected cell is empty", () => {
        const board = makeBoard();

        board.highlightSimilarNumbers(0, 0);

        expect(board.sudokuCells.flat().some((cell) => cell.isHighlighted)).toBe(false);
    });
});

describe("SudokuBoard miscellaneous methods", () => {
    it("returns the correct block number", () => {
        const board = makeBoard();

        expect(board.getBlockNumber(0, 0)).toBe(0);
        expect(board.getBlockNumber(0, 3)).toBe(1);
        expect(board.getBlockNumber(0, 6)).toBe(2);
        expect(board.getBlockNumber(3, 0)).toBe(3);
        expect(board.getBlockNumber(3, 3)).toBe(4);
        expect(board.getBlockNumber(3, 6)).toBe(5);
        expect(board.getBlockNumber(6, 0)).toBe(6);
        expect(board.getBlockNumber(6, 3)).toBe(7);
        expect(board.getBlockNumber(6, 6)).toBe(8);
        expect(board.getBlockNumber(9, 0)).toBe(-1);
    });

    it("returns false when the board is not full", () => {
        const board = makeBoard();

        expect(board.isBoardFull()).toBe(false);
    });

    it("returns true when the board is full", () => {
        const board = makeBoard("1");

        expect(board.isBoardFull()).toBe(true);
    });

    it("clears all candidates in a cell", () => {
        const board = makeBoard();
        const cell = board.sudokuCells[0][0];

        board.clearCandidates(cell);

        expect(cell.candidateBlock.cornerNotation.topCornerCandidates).toEqual([]);
        expect(cell.candidateBlock.cornerNotation.bottomCornerCandidates).toEqual([]);
        expect(cell.candidateBlock.centerNotation.centerCandidates).toEqual([]);
    });
});

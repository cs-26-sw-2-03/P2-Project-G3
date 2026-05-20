import { describe, it, expect } from "vitest";
import {
    validateBlock,
    validateRow,
    validateColumn,
    winChecker,
} from "../pages/sudokuPage/errorChecker.js";

function makeBoard(numbers) {
    return numbers.map((row) => row.map((number) => ({ number })));
}

const solvedBoard = makeBoard([
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
]);

describe("validateBlock", () => {
    it("returns true when a block contains numbers 1 through 9", () => {
        expect(validateBlock(0, 0, solvedBoard)).toBe(true);
    });

    it("returns false when a block is missing a number", () => {
        const board = makeBoard([
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, null, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ]);

        expect(validateBlock(0, 0, board)).toBe(false);
    });
});

describe("validateRow", () => {
    it("returns true when a row contains numbers 1 through 9", () => {
        expect(validateRow(0, solvedBoard)).toBe(true);
    });

    it("returns false when a row is missing a number", () => {
        const board = makeBoard([
            [5, 3, 4, 6, 7, 8, 9, 1, null],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ]);

        expect(validateRow(0, board)).toBe(false);
    });
});

describe("validateColumn", () => {
    it("returns true when a column contains numbers 1 through 9", () => {
        expect(validateColumn(0, solvedBoard)).toBe(true);
    });

    it("returns false when a column is missing a number", () => {
        const board = makeBoard([
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [null, 4, 5, 2, 8, 6, 1, 7, 9],
        ]);

        expect(validateColumn(0, board)).toBe(false);
    });
});

describe("winChecker", () => {
    it("returns true when every block, row, and column is valid", () => {
        expect(winChecker(solvedBoard)).toBe(true);
    });

    it("returns false when the board is not complete", () => {
        const board = makeBoard([
            [5, 3, 4, 6, 7, 8, 9, 1, null],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ]);

        expect(winChecker(board)).toBe(false);
    });
});

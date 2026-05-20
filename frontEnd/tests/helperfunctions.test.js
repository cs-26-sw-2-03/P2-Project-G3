import { describe, it, expect } from "vitest";
import {
    indexToRowAndColumn,
    rowAndColumnToIndex,
} from "../pages/sudokuPage/helperfunctions.js";

describe("indexToRowAndColumn", () => {
    it("converts a cell index to row and column", () => {
        expect(indexToRowAndColumn(0)).toEqual({ row: 0, column: 0 });
        expect(indexToRowAndColumn(8)).toEqual({ row: 0, column: 8 });
        expect(indexToRowAndColumn(9)).toEqual({ row: 1, column: 0 });
        expect(indexToRowAndColumn(40)).toEqual({ row: 4, column: 4 });
        expect(indexToRowAndColumn(80)).toEqual({ row: 8, column: 8 });
    });
});

describe("rowAndColumnToIndex", () => {
    it("converts row and column to a cell index", () => {
        expect(rowAndColumnToIndex(0, 0)).toBe(0);
        expect(rowAndColumnToIndex(0, 8)).toBe(8);
        expect(rowAndColumnToIndex(1, 0)).toBe(9);
        expect(rowAndColumnToIndex(4, 4)).toBe(40);
        expect(rowAndColumnToIndex(8, 8)).toBe(80);
    });
});

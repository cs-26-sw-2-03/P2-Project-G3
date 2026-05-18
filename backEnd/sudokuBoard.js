import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sudokuLevel } from "./proficiencyScoreCalc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, "SudokuPuzzles.csv");

export function GetSudokuBoard(sudokuNumber) {
    const csv = fs.readFileSync(CSV_PATH, "utf-8");
    
    if (!csv) {
        console.error("Could not load Sudoku string")
        return;
    }

    const puzzles = csv.split(",");

    let stringArr = [];
    let j = 0;

    for (var i = 0; i <= puzzles.length; i++) {

        let difArr = [puzzles[7 + i * 4]]

        j = puzzles[5 + i * 4]

        difArr.push(j)

        stringArr.push(difArr)
    }

    //finds the last defined index in the array
    for (var l = 0; l < stringArr.length; l++) {
        if (stringArr[l][0] == undefined) {
            console.log(l)
            console.log(stringArr[l][0])
            l--;
            break;
        }
    }

    //sorts the array by difficulty
    mergeSort(stringArr, 0, l)

    const sudokuString = stringArr[sudokuLevel(l)][1];

    return stringToBoard(sudokuString);
}

function stringToBoard(sudokuString) {
    const board = [];

    for (var i = 0; i < 9; i++) {
        const row = [];
        for (var j = 0; j < 9; j++) {
            const char = sudokuString[j+i*9];
            row.push(char === "." || char === "0" ? null : Number(char));
        }
        board.push(row);
    }

    return board;
}

function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const lArr = new Array(n1);
    const rArr = new Array(n2);

    for (var i = 0; i < n1; i++) {
        lArr[i] = arr[left + i]
        lArr[i][0] = Number(lArr[i][0]);
    }
    for (var j = 0; j < n2; j++) {
        rArr[j] = arr[mid + 1 + j]
        rArr[j][0] = Number(rArr[j][0]);
    }

    i = 0, j = 0;
    let k = left;

    while (i < n1 && j < n2) {
        if (lArr[i][0] <= rArr[j][0]) {
            arr[k] = lArr[i];
            i++;
        } else {
            arr[k] = rArr[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = lArr[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = rArr[j];
        j++;
        k++;
    }
}

function mergeSort(arr, left, right) {
    if (left >= right)
        return;

    const mid = Math.floor(left + (right - left) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

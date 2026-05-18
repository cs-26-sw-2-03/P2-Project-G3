// Import required libraries
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

// Import functions that work with the proficiency score
import { profScoreCalc } from "./backEnd/proficiencyScoreCalc.js";
import { getScore } from "./backEnd/proficiencyScoreCalc.js";
import { forfeitScore } from "./backEnd/proficiencyScoreCalc.js";

// Import function that reads a Sudoku board of the csv file
import { GetSudokuBoard } from "./backEnd/sudokuBoard.js";

import { solveSudoku } from "./backEnd/solveSudoku.js";

import { sudokuLevel } from "./backEnd/proficiencyScoreCalc.js";

const TOTAL_BOARDS = 344;

// Resolve __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create the Express app
const app = express();

// Allow base path to differ depending on whether we use localhost or AAU's server
const BASE_PATH = process.env.NODE_ENV === "production" ? "/node0" : "";

// Used to log all incoming requests
app.use((req, res, next) => {
  console.log("REQ: ", req.method, req.url);
  next();
});

// Simple health check / check connection
app.get("/health", (req, res) => {
  res.send("ok");
});

// API endpoint to fetch Sudoku board
app.get(`${BASE_PATH}/api/sudoku`, (req, res) => {
  // Read sudokuNumber from query string, default to 1
  const sudokuNumber = Number(req.query.sudokuNumber ?? 1);
  // Get the corresponding Sudoku board
  const board = GetSudokuBoard(sudokuNumber);
  let solvedSudoku = structuredClone(board);
  solveSudoku(solvedSudoku);
  console.log(solvedSudoku);
  // Send the board as a JSON file
  res.json({ board, solvedSudoku });
});

// API endpoint to fetch and change proficiency score
app.get(`${BASE_PATH}/api/proficiency`, (req, res) => {
    const err = Number(req.query.err ?? 0);
    const time = Number(req.query.time ?? 0);
    const data = profScoreCalc(err,time);
    res.json({ data });
});

// API endpoint to fetch proficiency score
app.get(`${BASE_PATH}/api/score`, (req, res) => {
    const data = getScore();
    res.json({ data });
});

// API endpoint to change proficiency score when forfeiting
app.get(`${BASE_PATH}/api/forfeitScore`, (req, res) => {
    const data = forfeitScore();
    res.json({ data });
});

// API endpoint to get sudoku level (decide board number)
app.get(`${BASE_PATH}/api/sudokuLevel`, (req, res) => {
    const data = sudokuLevel(TOTAL_BOARDS);
    res.json({ data });
});
        
// Returns the main (start) html page.
app.get(BASE_PATH, (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontEnd/pages/startPage/startPage.html")
  );
});

// Returns other frontend files
app.use(BASE_PATH, express.static(path.join(__dirname, "frontEnd")));

// Create HTTP server using the Express app
const server = http.createServer(app);

// Start the server on localhost:3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Server running on port 3000");
  console.log("http://localhost:3000/");
});

// Keep the Node.js process running
process.stdin.resume();
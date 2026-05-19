let userScore = 5

/**
 * Gets amount of error episodes and time (in seconds) taken while doing sudoku.
Calculates how well they completed the given task,
Then adds / subtracts points from their proficiency score.
Returns new proficiency score.
 * @param {number} err
 * @param {number} time
 * @returns {number}
 */
export function profScoreCalc(err, time) {

    //the numbers in this equation make it so that:
    //being under 15 min gives a score aproaching +1
    //~4 min gives a score of +0.5
    //~15 min gives a score of 0
    //~1 hour gives a score of -1
    let timeScore = 1 - Math.min(Math.sqrt(time / 60 * 0.07), 2)

    //the numbers in this equation make it so that:
    //having 0 errors gives a score of +0.5
    //having 1 error gives a score of +0.25
    //having 4 errors gives a score of -0.5
    //having 6+ errors gives a score of -1
    let errScore = 0.5 - Math.min(err * 0.25, 1.5)

    let finScore = Math.max(Math.min(
        userScore + Math.max(Math.min(
            timeScore + errScore,
            1), -1),
    10), 0)

    userScore = finScore;

    console.log("user proficiency is ", finScore)

    return finScore;
}

/**
 Gets amount of Sudokupuzzles in storage.
 Uses proficiency score. 
 Makes a percentile (how far to the most difficult sudoku you are).
 Uses a psuedo random number to skew this a bit forward or backwards.
 Returns the index number for the sudokustring in the array.
 * @param {number} stringAmount
 * @returns {string}
 */
export function sudokuLevel(stringAmount) {
    let stringNumber = 0;

    //
    stringNumber = Math.max(Math.min(
        Math.floor(stringAmount * userScore / 10),
        stringAmount - 5), 5);

    //Randomises the given sudoku between the closest 10 sudokus
    stringNumber = Math.min(Math.round(
        stringNumber + (5 - Math.random() * 10)
    ), stringAmount);

    console.log("selected sudoku", stringNumber, "as given sudoku")

    return stringNumber;
}

/**
 * Changes userScore by minus one, to a minimum of zero
 * @returns {number}
 */
export function forfeitScore() {
    userScore = Math.max(userScore - 1, 0)
    return userScore;
}

/**
 * Gets the profeciency score from ProficiencyScoreCalc.
 * @returns
 */
export function getScore() {
    return userScore;
}
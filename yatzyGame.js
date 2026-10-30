// game state lives here
const players = [];
const scoreTable = [];

// category name lists — script.js reads these boundaries only through the game
const UPPER_CATEGORIES = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
const LOWER_CATEGORIES = ['onepair', 'twopairs', 'threeofakind', 'fourofakind', 'fullhouse', 'smallstraight', 'largestraight', 'chance', 'yatzy'];

class yatzyGame {
  constructor() {
    this.currentPlayer = null;
    this.currentRound = null;
    this.totalScore = null;
    this.usedCategories = new Set();
    this.committedScores = {};
    this.rollCount = 0;
  }

  startNewGame() {
    // fresh scorecard: nothing used, nothing scored, no rolls yet
    this.usedCategories = new Set();
    this.committedScores = {};
    this.rollCount = 0;
    this.totalScore = 0;
  }

  recordRoll() {
    this.rollCount++;
  }

  canRoll() {
    return this.rollCount < 3;
  }

  hasRolled() {
    return this.rollCount > 0;
  }

  categoryUsed(category) {
    return this.usedCategories.has(category);
  }

  // turn ends: commit the chosen category, reset the roll counter
  endTurn(category, score) {
    this.usedCategories.add(category);
    this.committedScores[category] = score;
    this.rollCount = 0;
  }

  // running totals for the Sum / Bonus / TOTAL rows
  getTotals() {
    const sum = (categories) => categories.reduce((sum, c) => sum + (this.committedScores[c] || 0), 0);
    const upperSum = sum(UPPER_CATEGORIES);
    const bonus = upperSum >= 63 ? 50 : 0;
    return { upperSum, bonus, total: upperSum + bonus + sum(LOWER_CATEGORIES) };
  }

  allCategoriesUsed() {
    return UPPER_CATEGORIES.concat(LOWER_CATEGORIES).every(c => this.usedCategories.has(c));
  }

  endGame() {

  }
}

const game = new yatzyGame();

// scoring math lives here

// Upper section: category name -> face value to sum (ones:1 ... sixes:6)
const upperScoring = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 };
const lowerScoring = {
    onepair: scoreOnePair,
    twopairs: scoreTwoPairs,
    threeofakind: scoreThreeOfAKind,
    // ...
};


function calculateScore(category, rolledDie) {
    // rolledDie: array of Dice objects (see dice.js) — engine reads .value
    const face = upperScoring[category];
    if (face != undefined) {
      return rolledDie.reduce((sum, die) => die.value === face ? sum + die.value : sum, 0);   
    }
    const isCombination = lowerScoring[category];
    if (isCombination) {
        return combination(rolledDie);
    }
}

function isValidSelection(category, keptDie) {

}

function combination(rolledDie) {
    if()
}


// scoring math lives here

// Upper section: category name -> face value to sum (ones:1 ... sixes:6)
const upperScoring = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 };
// NOTE: commented out — these scorer functions don't exist yet, and the
// ReferenceError at load time would crash the whole script. calculateScore
// currently routes lower categories through combination() instead.
// const lowerScoring = {
//     onepair: scoreOnePair,
//     twopairs: scoreTwoPairs,
//     threeofakind: scoreThreeOfAKind,
//     // ...
// };


function calculateScore(category, rolledDie) {
    // rolledDie: array of Dice objects (see dice.js) — engine reads .value
    const face = upperScoring[category];
    if (face != undefined) {
      return rolledDie.reduce((sum, die) => die.value === face ? sum + die.value : sum, 0);   
    }
    // not an upper category -> lower section; combination() scores all
    // combinations at once and we pick the requested one
    return combination(rolledDie)[category];
}

function isValidSelection(category, keptDie) {

}

function combination(rolledDie) {
    // rolledDie: array of Dice objects -> extract plain face values
    const rolledValues = rolledDie.map(die => die.value);

    // tally: face -> frequency, e.g. [3,3,3,5,5] -> {3:3, 5:2}
    const counts = {};
    for (const value of rolledValues) {
        counts[value] = (counts[value] || 0) + 1;
    }

    const result = {
        onepair: 0,
        twopairs: 0,
        threeofakind: 0,
        fourofakind: 0,
        smallstraight: 0,
        largestraight: 0,
        fullhouse: 0,
        chance: 0,
        yatzy: 0,
    };

    // Object.keys returns STRINGS ('3', not 3) — convert back to numbers
    const faces = Object.keys(counts).map(Number);

    for (const face of faces) {
        const freq = counts[face];
        // "others <= 1": no other face may repeat for these to count
        const othersOk = faces.every(f => f === face || counts[f] <= 1);

        if (freq === 2 && othersOk) result.onepair = face * 2;
        if (freq === 3 && othersOk) result.threeofakind = face * 3;
        if (freq === 4 && othersOk) result.fourofakind = face * 4;
        if (freq === 5) result.yatzy = 50;
    }

    // two pairs ("at least" reading): every face with count >= 2 contributes
    // pairs (count 4 = two pairs of that face); score = two highest pairs
    const pairs = [];
    for (const face of faces) {
        const pairCount = Math.floor(counts[face] / 2);
        for (let i = 0; i < pairCount; i++) pairs.push(face);
    }
    if (pairs.length >= 2) {
        pairs.sort((a, b) => b - a);
        result.twopairs = (pairs[0] + pairs[1]) * 2;
    }

    // straights: all five faces must be present
    if ([1, 2, 3, 4, 5].every(f => counts[f] !== undefined)) result.smallstraight = 15;
    if ([2, 3, 4, 5, 6].every(f => counts[f] !== undefined)) result.largestraight = 20;

    // chance: any combination -> sum of all five dice
    const total = rolledValues.reduce((sum, value) => sum + value, 0);
    result.chance = total;

    // full house: a triple plus a different pair -> sum of all five dice
    const tripleFace = faces.find(f => counts[f] >= 3);
    const pairFace = faces.find(f => f !== tripleFace && counts[f] >= 2);
    if (tripleFace !== undefined && pairFace !== undefined) {
        result.fullhouse = total;
    }

    return result;
}


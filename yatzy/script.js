const headerUrl = 'header.html';
const footerUrl = 'footer.html';

async function loadContent(url, targetId) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const content = await response.text();
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.innerHTML = content;
        }

    } catch (error) {
        console.error(`Could not load ${url}:`, error);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = `<p style="color: red;">Error loading page components.</p>`;
        }
    }
}

loadContent(headerUrl, 'header');
loadContent(footerUrl, 'footer');

// Start button functionality
const boardStart = 'board-ingame.html'
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', startYatzy);

async function startYatzy() {
    await loadContent(boardStart, 'board-main-content');
    document.querySelector('header').style.cssText = 'font-size: 3rem; max-height: 6rem';
    initRolledDie();
    game.startNewGame();
    rollButton = document.getElementById('roll-dice');
    rollButton.addEventListener('click', renderDice);
    initScoreTableClicks();
    await loadDiceTemplate();
    firstKeptDice = document.getElementById("my-first-dice");
    secondKeptDice = document.getElementById("my-second-dice");
    thirdKeptDice = document.getElementById("my-third-dice");
    fourthKeptDice = document.getElementById("my-fourth-dice");
    fifthKeptDice = document.getElementById("my-fifth-dice");
}

const diceUrl = '../dice-design/main.html';
let diceTemplate;

async function loadDiceTemplate() {
    const response = await fetch(diceUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = await response.text();
    diceTemplate = wrapper;
}
const rolledDie = [];
const keptDie = [];
let rollButton;

async function renderDice() {
    const target = document.getElementById('dice-roll-render');
    if (!target || !diceTemplate) return;
    if (!game.canRoll()) return;
    
    target.innerHTML = '';
    numOfKeptDie = keptDie.length;
    const returnedDieArray = rollDie(rolledDie.length);
    returnedDieArray.forEach(dieObj => {
        const face = diceTemplate.querySelector(`#dice-${dieObj.value}`);
        const el = face.cloneNode(true);
    
        el.addEventListener('click', () => {
            dieObj.kept = !dieObj.kept;
            if (!dieObj.kept) {
                unkeepDice(dieObj);
                target.appendChild(el);
            }
            else {
                keepDice(dieObj,el);
            }
        });
        target.appendChild(el);
    });

    updatePreview();

    game.recordRoll();
    if (!game.canRoll()) {
        rollButton.disabled = true; // 3 rolls used — must score now
    }
}

function initRolledDie() {
    rolledDie.length = 0;
    for (let i = 0; i < 5; i++) {
        rolledDie.push(new Dice());
  }
}

function rollDie(value) {
    for (let i = 0; i < value; i++) {
        rolledDie[i].roll();
      }
      return rolledDie;
}

let firstKeptDice;
let secondKeptDice;
let thirdKeptDice;
let fourthKeptDice;
let fifthKeptDice;

function keepDice(newDice, el) {    
    keptDie.push(newDice);
    numOfKeptDie = keptDie.length;
    rolledDie.splice(rolledDie.indexOf(newDice), 1);
    
    if (numOfKeptDie == 1) {
        firstKeptDice.appendChild(el);
    }
    if (numOfKeptDie == 2) {
        secondKeptDice.appendChild(el);
    }
    if (numOfKeptDie == 3) {
        thirdKeptDice.appendChild(el);
    }
    if (numOfKeptDie == 4) {
        fourthKeptDice.appendChild(el);
    }
    if (numOfKeptDie == 5) {
        fifthKeptDice.appendChild(el);
    }
}

function unkeepDice(dice) {
    keptDie.splice(keptDie.indexOf(dice), 1);
    rolledDie.push(dice);
}

function getSelectedDice() {
    return keptDie;
}

// --- score table preview ---
const rowCategories = {
    'Ones': 'ones',
    'Twos': 'twos',
    'Threes': 'threes',
    'Fours': 'fours',
    'Fives': 'fives',
    'Sixes': 'sixes',
    'One pair': 'onepair',
    'Two pairs': 'twopairs',
    'Three of a kind': 'threeofakind',
    'Four of a kind': 'fourofakind',
    'Full House': 'fullhouse',
    'Small straight': 'smallstraight',
    'Large straight': 'largestraight',
    'Chance': 'chance',
    'Yatzy': 'yatzy',
};

// game state (used categories, committed scores, roll count, totals)
// lives in the yatzyGame instance in yatzyGame.js

function updatePreview() {
    const allDice = [...rolledDie, ...keptDie];
    document.querySelectorAll('#score-table tr').forEach(row => {
        const labelCell = row.cells[0];
        if (!labelCell) return;
        const category = rowCategories[labelCell.textContent.trim()];
        if (!category || game.categoryUsed(category)) return;
        row.cells[1].textContent = calculateScore(category, allDice);
    });
}

function initScoreTableClicks() {
    document.querySelectorAll('#score-table tr').forEach(row => {
        const labelCell = row.cells[0];
        if (!labelCell) return;
        const category = rowCategories[labelCell.textContent.trim()];
        if (!category) return;
        row.cells[1].addEventListener('click', () => commitScore(category, row));
    });
}

function commitScore(category, row) {
    if (game.categoryUsed(category)) return; // already scored
    if (!game.hasRolled()) return;           // must roll at least once first

    const score = calculateScore(category, [...rolledDie, ...keptDie]);
    game.endTurn(category, score);
    row.cells[1].textContent = score;
    row.style.opacity = 0.45; // mark category as used
    updateTotals();
    // clear stale previews on the still-unused rows
    document.querySelectorAll('#score-table tr').forEach(other => {
        const otherCategory = other.cells[0] && rowCategories[other.cells[0].textContent.trim()];
        if (otherCategory && !game.categoryUsed(otherCategory)) {
            other.cells[1].textContent = '';
        }
    });

    // new turn: dice back in the pool, button live again (rolls reset in endTurn)
    resetTurnDice();
    if (rollButton) rollButton.disabled = false;
}

function updateTotals() {
    const totals = game.getTotals();
    setTotalCell('Sum', totals.upperSum);
    setTotalCell('Bonus', totals.bonus);
    setTotalCell('TOTAL', totals.total);
}

function setTotalCell(label, value) {
    document.querySelectorAll('#score-table tr').forEach(row => {
        if (row.cells[0] && row.cells[0].textContent.trim() === label) {
            row.cells[1].textContent = value;
        }
    });
}

function resetTurnDice() {
    keptDie.forEach(die => rolledDie.push(die));
    keptDie.length = 0;
    [firstKeptDice, secondKeptDice, thirdKeptDice, fourthKeptDice, fifthKeptDice].forEach(slot => {
        if (slot) slot.innerHTML = '';
    });
    const target = document.getElementById('dice-roll-render');
    if (target) target.innerHTML = '';
}
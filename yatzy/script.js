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
    document.getElementById('roll-dice').addEventListener('click', renderDice);
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

async function renderDice() {
    const target = document.getElementById('dice-roll-render');
    if (!target || !diceTemplate) return;
    
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
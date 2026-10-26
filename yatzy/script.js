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
const board = document.getElementById('board-main-content');

startButton.addEventListener('click', startYatzy);

async function startYatzy() {
    await loadContent(boardStart, 'board-main-content');
    document.querySelector('header').style.cssText = 'font-size: 3rem; max-height: 6rem';

    document.getElementById('roll-dice').addEventListener('click', renderDice);
    await loadDiceTemplate();
}

// Roll dice
const diceUrl = '../dice-design/main.html';
let diceTemplate;
function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

async function loadDiceTemplate() {
    const response = await fetch(diceUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = await response.text();
    diceTemplate = wrapper;
}

async function renderDice() {
    const target = document.getElementById('dice-roll-render');
    if (!target || !diceTemplate) return;

    target.innerHTML = '';
    try {
        const response = await fetch('/roll-dice');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const values = await response.json();
        console.log('Server dice:', values);


        for (const val of values) {
            const face = diceTemplate.querySelector(`#dice-${val}`);
            target.appendChild(face.cloneNode(true));
        }
    } catch (error) {
        console.error('Could not roll dice:', error);
        target.innerHTML = '<p style="color: red;">Error rolling dice. Is the server running?</p>';
    }
}

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

    document.getElementById('roll-dice').addEventListener('click', renderDice);
    await loadDiceTemplate();
}

// Roll dice
const diceUrl = '../dice-design/main.html';
let diceTemplate;

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
}

class Dice {
    constructor() {
        this.value = null;
    }
    roll() {
        this.value = Math.floor(Math.random() * 6) + 1;
        return this.value;
    }
}

const die = [];

function initDie() {
    for (let i = 0; i < 5; i++) {
        die.push(new Dice());
  }
}

function rollAllDie(dieArray) {
    for (let i = 0; i < dieArray.length; i++) {
        dieArray[i].roll();
      }
      return dieArray;
}

const playerDie = [];

function keepDice(newDice) {
    playerDie.push(newDice);
}
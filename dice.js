class Dice {
    constructor() {
        this.value = null;
    }
    roll() {
        this.value = Math.floor(Math.random() * 6) + 1;
        return this.value;
    }
    getValue() {
        return this.value;
    }
}
class TripleClass {
    constructor(baseTriple) {
        this.baseTriple = baseTriple;
        this.multipliers = [1]
    }

    addMultiplier(multiplier) {
        this.multipliers.push(multiplier);
    }
}
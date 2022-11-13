import { PLATES, STUDS } from "./Unit.js"

class Dimension {
  constructor(length, unit) {
    this.unit = unit;
    this.length = length;
    this._multiplier = (unit === PLATES ? 4 : 10);
    this.normalizedLength = this.length * this._multiplier;
    this.isInteger = this._isInteger();
  }

  setNormalizedLength(length) {
     this.length = length / this._multiplier;
     this.normalizedLength = length;
     this.isInteger = this._isInteger();
  }

  _isInteger() {
    return this.length % 1 == 0;
  }

  divideOut(divisor) {
    this.length /= divisor;
    this.normalizedLength /= divisor;
  }

  toString() {
    return this.length.toString() + " " + this.unit;
  }
}

export default Dimension;
import { INTERNAL } from "./Unit"

class Dimension {
  constructor(length, unit) {
    this.unit = unit;
    this.setLength(length, unit);;
    this.isInteger = this._isInteger();
  }

  setLength(length, unit) {
     this.length = this.unit.from(length, unit);
     this._internalLength = INTERNAL.from(length, unit);
     this.isInteger = this._isInteger();
  }

  lengthIn(unit) {
    return unit.from(this.length, this.unit);
  }

  _isInteger() {
    return this.length % 1 == 0;
  }

  toString() {
    return this.length.toString() + " " + this.unit;
  }

  valueOf() {
    return this._internalLength;
  }
}

export default Dimension;
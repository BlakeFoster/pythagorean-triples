import { INTERNAL } from "./Unit"

class Dimension {
  constructor(length, unit) {
    this.unit = unit;
    this.length = this.unit.from(length, unit);
    this._internalLength = INTERNAL.from(length, unit);
  }

  to(unit) {
    return new Dimension(unit.from(this.length, this.unit), unit);
  }

  toString() {
    return this.length.toString() + " " + this.unit;
  }

  valueOf() {
    return this._internalLength;
  }
}

export default Dimension;
import { INTERNAL } from "./Unit"

class Dimension {
  constructor(length, unit, overhang) {
    this.unit = unit;
    this.sideLength = length;
    this.physicalLength = length + overhang
    this.overhang = overhang;
    this._internalLength = INTERNAL.from(length, unit);
  }

  to(unit) {
    return new Dimension(
      unit.from(this.sideLength, this.unit),
      unit,
      unit.from(this.overhang, this.unit),
    );
  }

  toString() {
    return this.sideLength.toString() + " " + this.unit;
  }

  valueOf() {
    return this._internalLength;
  }
}

export default Dimension;
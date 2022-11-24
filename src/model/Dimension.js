import { INTERNAL } from "./Unit"

class Dimension {
  constructor(length, unit, overhang) {
    console.log("Making new dimension with length " + length + " unit " + unit + " overhang " + overhang)
    this.unit = unit;
    this.sideLength = length;
    this.physicalLength = length + overhang[0]
    this.overhang = overhang;
    this._internalLength = INTERNAL.from(length, unit);
  }

  to(unit) {
    return new Dimension(
      unit.from(this.sideLength, this.unit),
      unit,
      this.overhang.map((o) => unit.from(o, this.unit)),
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
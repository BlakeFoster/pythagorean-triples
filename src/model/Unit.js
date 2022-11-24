export class Unit {
  constructor(name, numInternalUnits) {
    this.name = name;
    this._numInternalUnits = numInternalUnits;
  }

  to(length, unit) {
    return unit.from(length, this);
  }

  from(length, unit) {
    return unit._numInternalUnits * length / this._numInternalUnits;
  }

  toString() {
    return this.name;
  }
}

export const PLATES = new Unit("Plates", 4);
export const STUDS = new Unit("Studs", 10);
export const HALF_PLATES = new Unit("Half Plates", 2);
export const HALF_STUDS = new Unit("Half Studs", 5);
export const QUARTER_PLATES = new Unit("Quarter Plates", 1);
export const INTERNAL = QUARTER_PLATES;
export const RENDER_UNIT = INTERNAL;
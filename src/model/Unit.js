class Unit {
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

export const PLATES = new Unit("Plates", 2);
export const STUDS = new Unit("Studs", 5);
export const INTERNAL = new Unit("Internal", 1);
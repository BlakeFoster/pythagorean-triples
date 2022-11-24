import Dimension from "./Dimension"
import { STUDS, PLATES, HALF_PLATES, QUARTER_PLATES, INTERNAL } from "./Unit"
import { C } from "../constants"

const MIN_INTERNAL_LENGTH = INTERNAL.from(1, STUDS);


class SideConfig {
   /* maxLength: the maximum length in the requested unit.
    * requestedUnit: the unit that is preferred for this side.
    * constrain: True if only the requested unit should be used for this side.
    * sign: the sign si for this side in the equation s0 * l0^2 + s1 * l1^2 + s2 * l2^2 = 0
    * index: the side index, A=0, B=1, C=2
    */
  constructor(index, maxLength = null, requestedUnit = STUDS, constrain = true) {
    this.maxLength = maxLength;
    this.requestedUnit = requestedUnit;
    this.constrain = constrain;
    this.sign = index === C ? -1 : 1;
    this.index = index;
  }

  updateMaxLength(maxLength) {
    return new SideConfig(
      this.index,
      maxLength,
      this.requestedUnit,
      this.constrain
    );
  }

  updateRequestedUnit(requestedUnit) {
    return new SideConfig(
      this.index,
      this.maxLength,
      requestedUnit,
      this.constrain
    );
  }

  updateConstrain(constrain) {
    return new SideConfig(
      this.index,
      this.maxLength,
      this.requestedUnit,
      constrain
    );
  }

  toggleConstrain() {
    return this.updateConstrain(!this.constrain);
  }

  getPossibleUnits() {
    return this.constrain ? [this.requestedUnit] : [STUDS, PLATES]
  }

  isOk(internalLength, internalOverhang) {
    return (
      internalLength >= MIN_INTERNAL_LENGTH &&
      (
        this.maxLength == null ||
        internalLength <= INTERNAL.from(this.maxLength, this.requestedUnit)
      ) && this.getUnitOut(internalLength + internalOverhang[0]) != null
    );
  }

  getUnitOut(totalInternalLength) {
    for (let unit of this.getPossibleUnits()) {
      if (!(unit.from(totalInternalLength, INTERNAL) % 1)) {
        return unit;
      }
    }
    return null
  }

  getDimension(internalLength, internalOverhang) {
    console.log("getting dimension for internal length " + internalLength + " with overhang " + internalOverhang)
    const unit = this.getUnitOut(internalLength + internalOverhang[0]);
    console.log("Using unit " + unit)
    console.log("internal length is " + unit.from(internalLength, INTERNAL))
    console.log("new oeverhang is " + internalOverhang.map((o) => o.to(unit)))
    return new Dimension(
      unit.from(internalLength, INTERNAL),
      unit,
      internalOverhang.map((o) => unit.from(o, INTERNAL))
    );
  }

  toString() {
    return "maxLength=" + this.maxLength + ", requestedUnit=" + this.requestedUnit + ", constrain=" + this.constrain
  }

  [Symbol.iterator]() {
    var step = this.constrain ? HALF_PLATES.from(1, this.requestedUnit) : 1;
    var maxInternalLength = INTERNAL.from(this.maxLength, this.requestedUnit);
    var internalLength = 0;
    return {
      next: () => {
        internalLength += step;
        return {
          value: internalLength,
          done: internalLength > maxInternalLength
        }
      }
    };
  };
}


export default SideConfig;
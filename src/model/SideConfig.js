import Dimension from "./Dimension"
import { STUDS, PLATES, INTERNAL } from "./Unit"
import { C } from "../constants"


class SideConfig {
   /* maxDim: the maximum length as a Dimension object.
    * requestedUnit: the unit that is preferred for this side.
    * constrain: True if only the requested unit should be used for this side.
    * sign: the sign si for this side in the equation s0 * l0^2 + s1 * l1^2 + s2 * l2^2 = 0
    */
  constructor(index, maxLength = null, requestedUnit = STUDS, constrain = true) {
    this.maxLength = maxLength;
    this.requestedUnit = requestedUnit;
    this.constrain = constrain;
    this.sign = index === C ? -1 : 1;
    this.maxDim = this._getMaxDim();
    this.index = index;
  }

  updateMaxLength(maxLength) {
    return new SideConfig(
      this.index,
      maxLength,
      this.requestedUnit,
      this.constrain
    )
  }

  updateRequestedUnit(requestedUnit) {
    return new SideConfig(
      this.index,
      this.maxLength,
      requestedUnit,
      this.constrain
    )
  }

  toggleConstrain() {
    return new SideConfig(
      this.index,
      this.maxLength,
      this.requestedUnit,
      !this.constrain
    )
  }

  getPossibleUnits() {
    return this.constrain ? [this.requestedUnit] : [STUDS, PLATES]
  }

  isOk(internalLength) {
    return (
      internalLength > 0 &&
      (
        this.maxLength == null ||
        internalLength <= INTERNAL.from(this.maxLength, this.requestedUnit)
      ) &&
      this.getUnitOut(internalLength) != null
    );
  }

  _getMaxDim() {
    const dimension = new Dimension(
      this.maxLength == null ?
        this.requestedUnit.from(Number.MAX_VALUE - 1, INTERNAL) :
        this.maxLength,
      this.requestedUnit
    );
    return this.constrain ? dimension : dimension.to(INTERNAL);
  }

  getUnitOut(internalLength) {
    for (let unit of this.getPossibleUnits()) {
      if (!(unit.from(internalLength, INTERNAL) % 1)) {
        return unit;
      }
    }
    return null
  }

  getDimension(internalLength) {
    const unit = this.getUnitOut(internalLength);
    return new Dimension(unit.from(internalLength, INTERNAL), unit);
  }

  toString() {
    return "maxLength=" + this.maxLength + ", requestedUnit=" + this.requestedUnit + ", constrain=" + this.constrain
  }

  [Symbol.iterator]() {
    var step = this.constrain ? INTERNAL.from(1, this.requestedUnit) : 1;
    var maxInternalLength = INTERNAL.from(this.maxLength, this.requestedUnit);
    var internalLength = 0;
    return {
      next: () => {
        do {
          // skip over numbers that can't be created with just plates or just studs.
          internalLength += step;
        } while (!this.isOk(internalLength) && internalLength < maxInternalLength)
        return {
          value: internalLength,
          done: internalLength > maxInternalLength
        }
      }
    };
  };
}


export default SideConfig;
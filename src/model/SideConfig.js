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
    this.sign = index == C ? -1 : 1;
    this.maxDim = this._getMaxDim();
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

  updateConstrain(constrain) {
    return new SideConfig(
      this.index,
      this.maxLength,
      this.requestedUnit,
      constrain
    )
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

  getUnitOut(length) {
    if (this.constrain) {
      return this.requestedUnit;
    } else {
      const lengthInRequestUnit = this.requestedUnit.from(length, INTERNAL);
      if (lengthInRequestUnit % 1 === 0) {
        return this.requestedUnit;
      }
      const lengthInStuds = STUDS.from(length, INTERNAL);
      return (lengthInStuds % 1) ? PLATES : STUDS;
    }
  }

  getDimension(length) {
    const unit = this.getUnitOut(length);
    return new Dimension(unit.from(length, this.maxDim.unit), unit);
  }

  toString() {
    return "maxLength=" + this.maxLength + ", requestedUnit=" + this.requestedUnit + ", constrain=" + this.constrain
  }
}

export default SideConfig;
import Dimension from "./Dimension"
import { INTERNAL } from "./Unit"
import { atan2d, gcd, almostEqual } from "../lib/math"

const SIDE_A = 0;
const SIDE_B = 1;
const SIDE_C = 2;

class Triple {
  constructor(dimensions) {
    this._dimensions = dimensions;

    this._gcd = null;
    this._minimized = null;
    this._angle = null;
    this._isPythagorean = null;
  }

  isPythagorean() {
    if (this._isPythagorean == null) {
      this._isPythagorean = this._dimensions.reduce(
        (accumulator, value) => {return accumulator && value.isInteger && value.length !== 0},
        true
      ) && this.getA() ** 2 + this.getB() ** 2 === this.getC() ** 2;
    }
    return this._isPythagorean;
  }

  getAngle() {
    if (this._angle == null) {
      this._angle = atan2d(this.getB(), this.getA());
    }
    return this._angle;
  }

  _getMinimized() {
    if (this._minimized == null) {
      var internal = this.to(INTERNAL);
      if (internal.getGCD() === 1) {
        this._minimized = internal;
      } else {
        this._minimized = new Triple(
          internal._dimensions.map(
            (d) => {return new Dimension(d.length / internal.getGCD(), INTERNAL)}
          )
        )
      }
    }
    return this._minimized;
  }

  getGCD() {
    if (this._gcd == null) {
      this._gcd = this.isPythagorean() ? gcd(this.getA().length, this.getB().length, this.getC().length) : 1;
    }
    return this._gcd;
  }

  to(unit) {
    return new Triple(this._dimensions.map((d) => d.to(unit)));
  }

  hashKey() {
    const minimized = this._getMinimized();
    return minimized.toString();
  }

  getValue(index) {
    return this._dimensions[index];
  }

  toString() {
    return this.getA().toString() + ", " + this.getB().toString() + ", " + this.getC().toString();
  }

  getA() {
    return this._dimensions[SIDE_A];
  }

  getB() {
    return this._dimensions[SIDE_B];
  }

  getC() {
    return this._dimensions[SIDE_C];
  }


  compareTo(other, desiredAngle) {
    const thisAngle = this.getAngle();
    const otherAngle = other.getAngle();
    var angleDiffThis = Math.abs(thisAngle - desiredAngle);
    var angleDiffOther = Math.abs(otherAngle - desiredAngle);
    if (almostEqual(angleDiffThis, angleDiffOther)) {
      return thisAngle < otherAngle ? -1 : thisAngle > otherAngle ? 1 : 0;
    } else if (angleDiffThis < angleDiffOther) {
      return -1;
    } else if (angleDiffThis > angleDiffOther) {
      return 1;
    }
    return 0
  }
}

export default Triple;
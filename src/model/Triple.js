import Dimension from "./Dimension"
import { INTERNAL } from "./Unit"

function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function almostEqual(a, b) {
  const tolerance = 0.0001;
  return a > b - tolerance && a < b + tolerance;
}

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
      this._angle = Math.atan(this.getB() / this.getA()) * 180 / Math.PI;
    }
    return this._angle;
  }

  getMinimized() {
    if (this._minimized == null) {
      if (this.getGCD() == 1) {
        this._minimized = this;
      } else {
        this._minimized = new Triple(
          this._dimensions.map(
            (d) => {return new Dimension(d.length / this.getGCD(), d.unit)}
          )
        )
      }
    }
    return this._minimized;
  }

  getGCD() {
    if (this._gcd == null) {
      this._gcd = this.isPythagorean() ? gcd(gcd(this.getA().length, this.getB().length), this.getC().length) : 1;
    }
    return this._gcd;
  }

  hashKey() {
    const minimized = this.getMinimized();
    return minimized.toString();
  }

  static from2Sides(l1Index, l1, l1Unit, l2Index, l2, l2Unit, l3Index, l3Unit) {
    const dimensions = new Array(3);
    const l1Dim = new Dimension(l1, l1Unit);
    const l2Dim = new Dimension(l2, l2Unit);
    const l3Dim = new Dimension(
      l3Unit.from(
        Math.sqrt(
          (l2Index === 2 ? -1 : 1) * l1Dim ** 2 +
          (l1Index === 2 ? -1 : 1) * l2Dim ** 2
        ),
        INTERNAL
      ),
      l3Unit
    );
    dimensions[l1Index] = l1Dim;
    dimensions[l2Index] = l2Dim;
    dimensions[l3Index] = l3Dim;
    return new Triple(dimensions);
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
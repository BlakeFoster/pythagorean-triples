import Dimension from "./Dimension"
import { INTERNAL } from "./Unit"
import { gcd, almostEqual } from "../lib/math"
import { A, B, C } from "../constants"


class Triple {
  constructor(dimensions, angle) {
    this._dimensions = dimensions;
    this._angle = angle;
    this._gcd = null;
    this._minimized = null;
    this._isPythagorean = null;
  }

  getAngle() {
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
            (d) => new Dimension(
                    d.sideLength / internal.getGCD(),
                    INTERNAL,
                    d.overhang
                  )
          ),
          this._angle
        )
      }
    }
    return this._minimized;
  }

  getGCD() {
    if (this._gcd == null) {
      this._gcd = gcd(
        this.getA().sideLength,
        this.getB().sideLength,
        this.getC().sideLength
      );
    }
    return this._gcd;
  }

  to(unit) {
    return new Triple(this._dimensions.map((d) => d.to(unit)), this._angle);
  }

  hashKey() {
    const minimized = this._getMinimized();
    return minimized._dimensions.reduce(
      (acc, d) => d.sideLength + d.unit.name + acc,
      "."
    )
  }

  getValue(index) {
    return this._dimensions[index];
  }

  toString() {
    return (
      this.getAPhysicalDimension().toString() + ", " +
      this.getBPhysicalDimension().toString() + ", " +
      this.getCPhysicalDimension().toString()
    );
  }

  getA() {
    return this._dimensions[A];
  }

  getB() {
    return this._dimensions[B];
  }

  getC() {
    return this._dimensions[C];
  }

  _getPhysicalDimension(sideIndex, adjacentIndex) {
    return new Dimension(
      this._dimensions[sideIndex].physicalLength + (
        adjacentIndex == null  ? 0 : this._dimensions[sideIndex].unit.from(
          this._dimensions[adjacentIndex].overhang.length,
          this._dimensions[adjacentIndex].unit
        )
      ),
      this._dimensions[sideIndex].unit,
      0
    );
  }

  getAPhysicalDimension() {
    return this._getPhysicalDimension(A, B);
  }

  getBPhysicalDimension() {
    return this._getPhysicalDimension(B, A);
  }

  getCPhysicalDimension() {
    return this._getPhysicalDimension(C, null);
  }

  compareTo(other, desiredAngle) {
    var angleDiffThis = Math.abs(this._angle - desiredAngle);
    var angleDiffOther = Math.abs(other._angle - desiredAngle);
    if (almostEqual(angleDiffThis, angleDiffOther)) {
      return this._angle < other._angle ? -1 : this._angle > other._angle ? 1 : 0;
    } else if (angleDiffThis < angleDiffOther) {
      return -1;
    } else if (angleDiffThis > angleDiffOther) {
      return 1;
    }
    return 0
  }
}

export default Triple;
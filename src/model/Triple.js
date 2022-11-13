import Dimension from "./Dimension"


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


class Triple {
  constructor(l1Index, l1, l1Unit, l2Index, l2, l2Unit, l3Index, l3Unit) {
    this._array = new Array(3);
    this._array[l1Index] = new Dimension(l1, l1Unit);
    this._array[l2Index] = new Dimension(l2, l2Unit);
    this._array[l3Index] = new Dimension(0, l3Unit);

    this._array[l3Index].setNormalizedLength(
      Math.sqrt(
        (l2Index === 2 ? -1 : 1) * this._array[l1Index].normalizedLength ** 2 +
        (l1Index === 2 ? -1 : 1) * this._array[l2Index].normalizedLength ** 2
      )
    )
    this.a = this._array[0];
    this.b = this._array[1];
    this.c = this._array[2];
    this.angle = Math.atan(this.b.normalizedLength / this.a.normalizedLength) * 180 / Math.PI;
    this.isPythagorean = this._array.reduce(
      (accumulator, value) => {return accumulator && value.isInteger && value.length !== 0},
      true
    ) && this.a.normalizedLength ** 2 + this.b.normalizedLength ** 2 === this.c.normalizedLength ** 2;

    if (this.isPythagorean) {
      const divisor = gcd(gcd(this.a.length, this.b.length), this.c.length);
      this._array.map((value) => {return value.divideOut(divisor)});
    }
    this.key = this.toString();
  }

  getValue(index) {
    return this._array[index];
  }

  toString() {
    return "(" + this.a + ", " + this.b + ", " + this.c + ")"
  }

  compareTo(other, desiredAngle) {
    var angleDiffThis = Math.abs(this.angle - desiredAngle);
    var angleDiffOther = Math.abs(other.angle - desiredAngle);
    if (almostEqual(angleDiffThis, angleDiffOther)) {
      return this.angle < other.angle ? -1 : this.angle > other.angle ? 1 : 0;
    } else if (angleDiffThis < angleDiffOther) {
      return -1;
    } else if (angleDiffThis > angleDiffOther) {
      return 1;
    }
    return 0
  }
}

export default Triple;
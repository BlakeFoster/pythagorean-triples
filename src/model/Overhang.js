import Dimension from "./Dimension"
import { INTERNAL } from "./Unit"

class Overhang {
  constructor(length, lShift, wShift) {
    this.length = length;
    this.lShift = lShift;
    this.wShift = wShift;
  }

  transform(fromUnit, toUnit) {
    return new Overhang(
      toUnit.from(this.length, fromUnit),
      toUnit.from(this.lShift, fromUnit),
      toUnit.from(this.wShift, fromUnit),
    )
  }
}

export const ZERO = new Overhang(0, 0, 0);

export default Overhang;

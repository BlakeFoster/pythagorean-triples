import { STUDS, INTERNAL } from "./Unit"
import Dimension from "./Dimension"

class VertexConfig {
  /* name: user-facing label
   * overhang: the additional length beyond the vertices for sides with this config
   * requiredUnit: a unit that this config must use, or null if there is no requirement
   */
  constructor(name, overhang, requiredUnit) {
    this.name = name;
    this.overhang = overhang;
    this.requiredUnit = requiredUnit;
  }

  toString() {
    return this.name;
  }

  valueOf() {
    return this.name;
  }
}

export const HINGE_PLATE = new VertexConfig(
  "Hinge Plates",
  new Dimension(0, INTERNAL),
  null
)

export const SINGLE_STUD = new VertexConfig(
  "Single Stud",
  new Dimension(1, STUDS),
  null
)
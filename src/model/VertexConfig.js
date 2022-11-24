import { STUDS, INTERNAL, HALF_PLATES, HALF_STUDS } from "./Unit"
import Dimension from "./Dimension"
import Overhang, { ZERO } from "./Overhang"


class VertexLocation {
  /* name: user-facing label
   * overhangCombinations: a nested array of possible overhangs--that is the additional length beyond the vertices for
   * sides with this config--that are possible. Each item in the array has the overhang for sides A, B, and C in order.
   */
  constructor(name, overhangUnit, overhangCombinations) {
    this.name = name;
    this.overhangUnit = overhangUnit;
    this.overhangCombinations = overhangCombinations.map(
      (oc) => oc.map(
        (o) => new Overhang(o[0], o[1], o[2])
      )
    )
    console.log(this.overhangCombinations)
  }

  toString() {
    return this.name;
  }

  valueOf() {
    return this.name;
  }
}



export const CORNER = new VertexLocation(
  "Corner",
  INTERNAL,
  [[[0, 0, 0], [0, 0, 0], [0, 0, 0]]] // triangle side length always equals brick length.
)

export const CENTER = new VertexLocation(
  "Stud Center",
  HALF_STUDS,
  [
      [[0, 1, 1], [0, 1, 1], [2, 1, 1]], // only side c has an overhang; this is the configuration without a stud at the A/B vertex.
      [[2, 1, 1], [0, 1, 1], [2, 1, 1]], // sides a and c have overhangs; the A/B vertex is occupied by side A
      [[0, 1, 1], [2, 1, 1], [2, 1, 1]] // sides b and c have overhangs; the A/B vertex is occupied by side B.
      // note: [1, 1, 1 is not possible because the A/B vertex can't be occupied by both A and B at once.
  ]
)

class VertexConfig {
  constructor(enableCorner = true, enableCenter = false) {
    this.enableCorner = enableCorner;
    this.enableCenter = enableCenter;
  }

  getVertexLocations() {
    var locations = []
    if (this.enableCorner) {
      locations.push(CORNER)
    }
    if (this.enableCenter) {
      locations.push(CENTER)
    }
    return locations;
  }

  toggleCorner() {
    return new VertexConfig(
      !this.enableCorner,
      this.enableCorner || this.enableCenter
    )
  }

  toggleCenter() {
    return new VertexConfig(
      this.enableCorner || this.enableCenter,
      !this.enableCenter
    )
  }

  getOverhangCombinations(unit) {
    return this.getVertexLocations().reduce(
      (acc, l) => acc.concat(
        l.overhangCombinations.map(
          (oc) => oc.map(o => o.transform(l.overhangUnit, unit))
        )
      ),
      []
    )
  }

  toString() {
    return "enableCorner=" + this.enableCorner + " enableCenter=" + this.enableCenter;
  }
}

export default VertexConfig;
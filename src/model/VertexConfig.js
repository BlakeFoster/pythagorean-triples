import { STUDS, INTERNAL, HALF_PLATES, HALF_STUDS } from "./Unit"
import Dimension from "./Dimension"

class VertexLocation {
  /* name: user-facing label
   * overhangCombinations: a nested array of possible overhangs--that is the additional length beyond the vertices for
   * sides with this config--that are possible. Each item in the array has the overhang for sides A, B, and C in order.
   */
  constructor(name, overhangUnit, overhangCombinations) {
    this.name = name;
    this.overhangCombinations = overhangCombinations.map(
      (oc) => oc.map(
        (o) => [
          new Dimension(o[0], overhangUnit, [0, 0]),
          new Dimension(o[1], overhangUnit, [0, 0])
        ]
      )
    )
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
  [[[0, 0], [0, 0], [0, 0]]] // triangle side length always equals brick length.
)

export const CENTER = new VertexLocation(
  "Stud Center",
  HALF_STUDS,
  [
      [[0, 0], [0, 0], [2, 1]], // only side c has an overhang; this is the configuration without a stud at the A/B vertex.
      [[2, 1], [0, 0], [2, 1]], // sides a and c have overhangs; the A/B vertex is occupied by side A
      [[0, 0], [2, 1], [2, 1]] // sides b and c have overhangs; the A/B vertex is occupied by side C.
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

  getOverhangCombinations() {
    return this.getVertexLocations().reduce(
      (acc, l) => acc.concat(l.overhangCombinations),
      []
    )
  }

  toString() {
    return "enableCorner=" + this.enableCorner + " enableCenter=" + this.enableCenter;
  }
}

export default VertexConfig;
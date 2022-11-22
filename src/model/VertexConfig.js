import { STUDS, INTERNAL } from "./Unit"
import Dimension from "./Dimension"

class VertexLocation {
  /* name: user-facing label
   * overhang: the additional length beyond the vertices for sides with this config
   */
  constructor(name, overhang, overhangCombinations) {
    this.name = name;
    this.overhang = overhang;
    const nullOverhang = new Dimension(0, overhang.unit);
    this.overhangCombinations = overhangCombinations.map(
      (oc) => oc.map((o) => o ? overhang : nullOverhang)
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
  new Dimension(0, INTERNAL),
  [[false, false, false]] // triangle side length always equals brick length.
)

export const CENTER = new VertexLocation(
  "Stud Center",
  new Dimension(1, STUDS),
  [
      [false, false, true], // one side c has an overhang; this is the configuration without a stud at the A/B vertex.
      [true, false, true], // sides a and c have overhangs; the A/B vertex is occupied by side A
      [false, true, true] // sides b and c have overhangs; the A/B vertex is occupied by side C.
      // note: [true, true, true is not possible because the A/B vertex can't be occupied by both A and B at once.
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
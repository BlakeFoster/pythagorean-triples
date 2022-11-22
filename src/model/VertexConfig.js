import { STUDS, INTERNAL } from "./Unit"
import Dimension from "./Dimension"

class VertexLocation {
  /* name: user-facing label
   * overhang: the additional length beyond the vertices for sides with this config
   */
  constructor(name, overhang) {
    this.name = name;
    this.overhang = overhang;
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
  new Dimension(0, INTERNAL)
)

export const CENTER = new VertexLocation(
  "Stud Center",
  new Dimension(1, STUDS)
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

  toString() {
    return "enableCorner=" + this.enableCorner + " enableCenter=" + this.enableCenter;
  }
}

export default VertexConfig;
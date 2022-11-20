import Dimension from "../model/Dimension"
import Triple from "../model/Triple"
import { STUDS, PLATES, INTERNAL } from "../model/Unit"
import { A, B, C, SIDES } from "../constants"
import { applyPermutation, reversePermutation } from "../lib/math"


function getPermutation(sideConfigs) {
  /* get the side indexes in the order they will be determined */
  if (sideConfigs[A].maxLength == null) {
    return [B, C, A];
  } else if (sideConfigs[B].maxLength == null) {
    return [A, C, B];
  } else {
    return [A, B, C];
  }
}


function sortTripleGroups(tripleGroups, desiredAngle) {
  var sortedGroups = [];
  for (let tripleGroup of tripleGroups.values()) {
    var gcds = Array.from(tripleGroup.keys());
    gcds.sort();
    sortedGroups.push(
      gcds.map(
        (key) => {return tripleGroup.get(key)}
      )
    );
  }
  sortedGroups.sort(
    (a, b) => {
      return a[0].compareTo(b[0], desiredAngle)
    }
  );
  if (sortedGroups.length > 10) {
    console.log("Truncating to top 10")
    sortedGroups = sortedGroups.slice(0, 10);
  }
  sortedGroups.forEach(
    (tripleGroup) => {
      console.log("Found triple group with angle " + tripleGroup[0].getAngle())
      tripleGroup.forEach(
        (triple) => {console.log("  Found triple " + triple.toString())}
      )
    }
  )
  return sortedGroups;
}


function getDimension2(dimension0, dimension1, sideConfigs) {
  const length2 = Math.sqrt(
    -sideConfigs[2].sign * (
      sideConfigs[0].sign * dimension0 ** 2 +
      sideConfigs[1].sign * dimension1 ** 2
    )
  )
  const unit2 = sideConfigs[2].getUnitOut(length2)
  return new Dimension(unit2.from(length2, INTERNAL), unit2);
}


function calculateTriples(sideConfigs, angleConfig) {

  const permutation = getPermutation(sideConfigs)

  sideConfigs = applyPermutation(sideConfigs, permutation)

  const dimensions = new Array(3);
  var tripleGroups = new Map();

  for (var l0=1; l0<=sideConfigs[0].maxDim.length; l0++) {
    dimensions[0] = sideConfigs[0].getDimension(l0);
    for (var l1=1; l1<=sideConfigs[1].maxDim.length; l1++) {
      dimensions[1] = sideConfigs[1].getDimension(l1);
      dimensions[2] = getDimension2(dimensions[0], dimensions[1], sideConfigs);

      const triple = new Triple(reversePermutation(dimensions, permutation));
      if (sideConfigs[2].isOk(dimensions[2]) && angleConfig.isOk(triple.getAngle()) && triple.isPythagorean()) {
        const key = triple.hashKey();
        var tripleGroup = tripleGroups.get(key);
        if (tripleGroup == null) {
          tripleGroup = new Map();
          tripleGroups.set(key, tripleGroup);
        }
        tripleGroup.set(triple.to(INTERNAL).getGCD(), triple);
      }
    }
  }
  return sortTripleGroups(tripleGroups, angleConfig.desiredAngle);
}

export default calculateTriples;
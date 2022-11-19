import Dimension from "../model/Dimension"
import Triple from "../model/Triple"
import { STUDS, PLATES, INTERNAL } from "../model/Unit"
import { A, B, C, SIDES } from "../constants"


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


function calculateTriples(sideConfigs, angleConfig) {

  const permutation = getPermutation(sideConfigs)

  const dimensions = new Array(3);
  var tripleGroups = new Map();

  for (var l0=1; l0<=sideConfigs[permutation[0]].maxDim.length; l0++) {
    const l0Dim = sideConfigs[permutation[0]].getDimension(l0);
    dimensions[permutation[0]] = l0Dim;

    for (var l1=1; l1<=sideConfigs[permutation[1]].maxDim.length; l1++) {
      const l1Dim = sideConfigs[permutation[1]].getDimension(l1)
      dimensions[permutation[1]] = l1Dim
      const l2 = Math.sqrt(
        sideConfigs[permutation[0]].sign * l0Dim ** 2 +
        sideConfigs[permutation[1]].sign * l1Dim ** 2
      )
      const l2Unit = sideConfigs[permutation[2]].getUnitOut(l2)
      const l2Dim = new Dimension(l2Unit.from(l2, INTERNAL), l2Unit);
      dimensions[permutation[2]] = l2Dim;

      console.log("l0 = " + l0 + " l1 = " + l1 + " l2 = " + l2)

      const triple = new Triple([...dimensions])
      console.log("Checking " + triple.toString())
      if (l2Dim > 0 && l2Dim <= sideConfigs[permutation[2]].maxDim && triple.isPythagorean()) {
        if (angleConfig.isAngleOk(triple.getAngle())) {
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
  }
  return sortTripleGroups(tripleGroups, angleConfig.desiredAngle);
}

export default calculateTriples;
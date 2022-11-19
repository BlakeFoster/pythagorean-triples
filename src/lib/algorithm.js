import Dimension from "../model/Dimension"
import Triple from "../model/Triple"
import { STUDS, PLATES, INTERNAL } from "../model/Unit"
import SideConfig from "../model/SideConfig"
import { A, B, C } from "../constants"


function getPermutation(maxLengths) {
  /* get the side indexes in the order they will be determined */
  if (maxLengths[A] == null) {
    return [B, C, A];
  } else if (maxLengths[B] == null) {
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


function calculateTriples(maxLengths, desiredAngle, allowOver, allowUnder, requestedUnits, constrain) {

  const permutation = getPermutation(maxLengths)

  const config = new Array(3);
  for (var i=0; i<3; i++) {
    config[i] = new SideConfig(maxLengths[i], requestedUnits[i], constrain[i], i);
  }

  const dimensions = new Array(3);
  var tripleGroups = new Map();

  for (var l0=1; l0<=config[permutation[0]].maxDim.length; l0++) {
    const l0Dim = config[permutation[0]].getDimension(l0);
    dimensions[permutation[0]] = l0Dim;

    for (var l1=1; l1<=config[permutation[1]].maxDim.length; l1++) {
      const l1Dim = config[permutation[1]].getDimension(l1)
      dimensions[permutation[1]] = l1Dim
      const l2 = Math.sqrt(
        config[permutation[0]].sign * l0Dim ** 2 +
        config[permutation[1]].sign * l1Dim ** 2
      )
      const l2Unit = config[permutation[2]].getUnitOut(l2)
      const l2Dim = new Dimension(l2Unit.from(l2, INTERNAL), l2Unit);
      dimensions[permutation[2]] = l2Dim;

      console.log("l0 = " + l0 + " l1 = " + l1 + " l2 = " + l2)

      const triple = new Triple([...dimensions])
      console.log("Checking " + triple.toString())
      if (l2Dim > 0 && l2Dim <= config[permutation[2]].maxDim && triple.isPythagorean()) {
        const angleDifference = triple.getAngle() - desiredAngle;
        if ((angleDifference >= 0 || allowUnder) && (angleDifference <= 0 || allowOver)) {
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
  return sortTripleGroups(tripleGroups, desiredAngle);
}

export default calculateTriples;
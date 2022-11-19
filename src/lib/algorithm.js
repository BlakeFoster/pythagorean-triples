import Dimension from "../model/Dimension"
import Triple from "../model/Triple"
import { STUDS, PLATES, INTERNAL } from "../model/Unit"


const A = 0;
const B = 1;
const C = 2;


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


function getUnitOut(index, length, requestedUnits, constrain) {
  const selectedUnit = requestedUnits[index];
  if (constrain[index]) {
    return selectedUnit;
  } else {
    const lengthInSelectedUnit = selectedUnit.from(length, INTERNAL);
    if (lengthInSelectedUnit % 1 === 0) {
      return requestedUnits[index];
    }
    const lengthInStuds = STUDS.from(length, INTERNAL);
    const unit = (lengthInStuds % 1) ? PLATES : STUDS;
    return unit;
  }
}


function getMaxDimension(index, maxLengths, requestedUnits, constrain) {
  const dimension = new Dimension(
    maxLengths[index] == null ?
      requestedUnits[index].from(Number.MAX_VALUE - 1, INTERNAL) :
      maxLengths[index],
    requestedUnits[index]
  );
  return constrain[index] ? dimension : dimension.to(INTERNAL);
}


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


function getSign(index, permutation) {
  /* get the sign for the given side index in the equation s0 * l0^2 + s1 * l1^2 + s2 * l2^2 = 0 */
  return permutation[index] === C ? -1 : 1;
}


function calculateTriples(maxLengths, desiredAngle, allowOver, allowUnder, requestedUnits, constrain) {

  const permutation = getPermutation(maxLengths)

  const maxDim = new Array(3);
  for (var i=0; i<3; i++) {
    maxDim[i] = getMaxDimension(i, maxLengths, requestedUnits, constrain);
  }

  const dimensions = new Array(3);
  var tripleGroups = new Map();

  console.log("Max dimensions: (" + new Triple(maxDim).toString() + ")")

  const l0Sign = getSign(0, permutation);
  const l1Sign = getSign(1, permutation);

  for (var l0=1; l0<=maxDim[permutation[0]].length; l0++) {
    const l0Unit = getUnitOut(permutation[0], l0, requestedUnits, constrain);
    const l0Dim = new Dimension(l0Unit.from(l0, maxDim[permutation[0]].unit), l0Unit);
    dimensions[permutation[0]] = l0Dim;

    for (var l1=1; l1<=maxDim[permutation[1]].length; l1++) {
      const l1Unit = getUnitOut(permutation[1], l1, requestedUnits, constrain);
      const l1Dim = new Dimension(l1Unit.from(l1, maxDim[permutation[1]].unit), l1Unit);
      dimensions[permutation[1]] = l1Dim
      const l2 = Math.sqrt(l0Sign * l0Dim ** 2 + l1Sign * l1Dim ** 2)
      const l2Unit = getUnitOut(permutation[2], l2, requestedUnits, constrain);
      const l2Dim = new Dimension(l2Unit.from(l2, INTERNAL), l2Unit);

      dimensions[permutation[2]] = l2Dim;
      const triple = new Triple([...dimensions])
      if (l2Dim > 0 && l2Dim <= maxDim[permutation[2]] && triple.isPythagorean()) {
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
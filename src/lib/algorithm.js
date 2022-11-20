import Triple from "../model/Triple"
import { A, B, C } from "../constants"
import { applyPermutation, reversePermutation } from "../lib/math"
import { atan2d } from "../lib/math"
import { INTERNAL } from "../model/Unit"


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
    var triples = Array.from(tripleGroup.values());
    triples.sort((t1, t2) => t1.getA() > t2.getA() ? 1 : t1.getA() < t2.getA() ? -1 : 0)
    sortedGroups.push(triples);
  }
  sortedGroups.sort(
    (a, b) => {
      return a[0].compareTo(b[0], desiredAngle)
    }
  );
  console.log(desiredAngle)
  console.log(
    sortedGroups.map((g) => g[0].getAngle())
  )
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


function calculateTriples(sideConfigs, angleConfig, vertexConfig) {

  const permutation = getPermutation(sideConfigs)
  sideConfigs = applyPermutation(sideConfigs, permutation)
  const overhang = vertexConfig.overhang.to(INTERNAL);

  var tripleGroups = new Map();

  for (let l0 of sideConfigs[0]) {
    if (sideConfigs[0].isOk(l0)) {
      for (let l1 of sideConfigs[1]) {
        if (sideConfigs[1].isOk(l1)) {
          const l2 = Math.sqrt(
            -sideConfigs[2].sign * (
              sideConfigs[0].sign * l0 ** 2 +
              sideConfigs[1].sign * l1 ** 2
            )
          )
          const sides = reversePermutation([l0, l1, l2], permutation);
          const angle = atan2d(sides[B], sides[A]);
          if (sideConfigs[2].isOk(l2) && angleConfig.isOk(angle)) {
            const triple = new Triple(
              sides.map((l, i) => sideConfigs[i].getDimension(l)),
              angle
            );
            const key = triple.hashKey();
            var tripleGroup = tripleGroups.get(key);
            if (tripleGroup == null) {
              tripleGroup = new Map();
              tripleGroups.set(key, tripleGroup);
              console.log("Found new triple group with angle " + angle);
            }
            tripleGroup.set(l0, triple);
          }
        }
      }
    }
  }
  return sortTripleGroups(tripleGroups, angleConfig.desiredAngle);
}

export default calculateTriples;
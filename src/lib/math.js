const _DEG_TO_RAD = Math.PI / 180;

export function gcd(a, ...rest) {
  /* gcd of n numbers */
  if (rest.length) {
    var b = gcd(...rest)
    a = Math.abs(a);
    while(b) {
      var t = b;
      b = a % b;
      a = t;
    }
  }
  return a;
}

export function almostEqual(a, b, tolerance=0.0001) {
  /* equality with a small tolerance for roundoff error */
  return a > b - tolerance && a < b + tolerance;
}

export function sind(a) {
  /* sin with angle in degrees */
  return Math.sin(a * _DEG_TO_RAD);
}

export function cosd(a) {
  /* cos with angle in degrees */
  return Math.cos(a * _DEG_TO_RAD);
}

export function atan2d(b, a) {
  /* arctan with angle in degrees */
  return Math.atan2(b, a) / _DEG_TO_RAD;
}

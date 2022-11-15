export function getAngle(a, b) {
  return Math.atan(b / a) * 180 / Math.PI;
}

export function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function almostEqual(a, b, tolerance=0.0001) {
  return a > b - tolerance && a < b + tolerance;
}
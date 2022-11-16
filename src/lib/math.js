const _DEG_TO_RAD = Math.PI / 180;

export function getAngle(a, b) {
  return Math.atan(b / a) / _DEG_TO_RAD;
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

export function sind(a) {
  return Math.sin(a * _DEG_TO_RAD);
}

export function cosd(a) {
  return Math.cos(a * _DEG_TO_RAD);
}

class AngleConfig {
  constructor(desiredAngle = null, allowOver = true, allowUnder = true) {
    this.desiredAngle = desiredAngle;
    this.allowOver = allowOver;
    this.allowUnder = allowUnder;
  }

  updateDesiredAngle(desiredAngle) {
    return new AngleConfig(
      desiredAngle,
      this.allowOver,
      this.allowUnder
    );
  }

  toggleAllowOver() {
    return new AngleConfig(
      this.desiredAngle,
      !this.allowOver,
      this.allowUnder || this.allowOver
    );
  }

  toggleAllowUnder() {
    return new AngleConfig(
      this.desiredAngle,
      this.allowOver || this.allowUnder,
      !this.allowUnder
    );
  }

  isOk(angle) {
    const angleDifference = angle - this.desiredAngle;
    return (angleDifference >= 0 || this.allowUnder) && (angleDifference <= 0 || this.allowOver);
  }

  toString() {
    return "desiredAngle=" + this.desiredAngle + ", allowOver=" + this.allowOver + ", allowUnder=" + this.allowUnder;
  }
}

export default AngleConfig;
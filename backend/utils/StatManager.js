export default class StatManager {
  constructor() {
    this.shots = 0
    this.hit = 0
    this.miss = 0
    this.win = false
    this.bullseye = false
  }

  defineWinner(win) {
    this.win = win
  }

  defineBullseye(bullseye) {
    this.bullseye = bullseye
  }

  incShot() {
    this.shots += 1
  }

  incMiss() {
    this.miss += 1
  }

  incHit() {
    this.hit += 1
  }

  saveShot(shotResult) {
    this.incShot()
    if (shotResult) this.incHit()
    else this.incMiss()
  }
}
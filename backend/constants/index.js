import * as ships from "./ships";

export const HIT = "hit";
export const SUNK = "sunk";
export const MISS = "miss";


export const shipsLeftTemplate = () => {
  return Object.values(ships).reduce((acc, item) => {
    acc[item] = []
    return acc
  }, {})
}

export const avatarTempPath = "tmp";
export const avatarImgName = "img.png";
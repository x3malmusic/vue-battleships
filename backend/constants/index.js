export const HIT = "hit";
export const MISS = "miss";

export const deck_1 = "deck-1";
export const deck_2 = "deck-2";
export const deck_3 = "deck-3";
export const deck_4 = "deck-4";

export const shipsLeftTemplate = () => {
  return [deck_1, deck_2, deck_3, deck_4].reduce((acc, item) => {
    acc[item] = []
    return acc
  }, {})
}
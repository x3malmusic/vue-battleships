import MatchManager from "./MatchManager";
import StatManager from "./StatManager";
import { createDBWorker } from "../helpers/createWorker";

export default new Proxy(MatchManager, {
  construct(target, args) {
    const [player1, player2] = args;
    const match = new target(player1, player2)

    match[player1.id].gameResult = new StatManager()
    match[player2.id].gameResult = new StatManager()

    let loserId = ""
    let winnerId = ""

    return new Proxy(match, {
      get: (obj, key) => {
        switch (key) {
          case "playerShot": {
            return function (...rest) {
              const result = obj[key].apply(this, rest)

              const [_, a, shooterId] = rest;
              const gameResult = match[shooterId].gameResult;

              if (gameResult.shots === 0 && result) gameResult.defineBullseye(true)

              gameResult.saveShot(result)

              return result
            }
          }
          case "playerHasShipsAlive": {
            return function (...rest) {
              const result = obj[key].apply(this, rest)

              if (!result) {
                loserId = rest[0]
                winnerId = match.getSecondPlayer(loserId)

                match[winnerId].gameResult.defineWinner(true)
              }
              return result
            }
          }
          default: {
            return Reflect.get(obj, key)
          }
        }
      },
      set: async (obj, key, value) => {
        obj[key] = value

        if (key === "gameIsOver") {
          createDBWorker({ ...match[loserId].gameResult, userId: match[loserId].dbId, opponent: match[winnerId].name }, loserId)
          createDBWorker({ ...match[winnerId].gameResult, userId: match[winnerId].dbId, opponent: match[loserId].name }, winnerId)
        }

        return true
      }
    });
  }
});


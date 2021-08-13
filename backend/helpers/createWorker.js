import cp from "child_process"
import Emitter from "../utils/Emitter";
import { EMITTER_SAVE_DATABASE } from "../constants/socket_events";

export const createDBWorker = (data, socketId) => {
  const worker = cp.fork('./worker')

  function listener(message) {
    worker.removeListener("message", listener)
    Emitter.emit(`${EMITTER_SAVE_DATABASE}${socketId}`, message)
    worker.kill()
  }

  worker.send(data)
  worker.addListener("message", listener)
}
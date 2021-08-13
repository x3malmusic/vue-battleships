import EventEmitter from "events"

// class Emitter extends EventEmitter {
//   constructor() {
//     super();
//     if (Emitter.exists) {
//       return Emitter.instance
//     }
//     Emitter.instance = this
//     Emitter.exists = true
//   }
// }

export default new EventEmitter
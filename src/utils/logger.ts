import { env } from "src/env"
const pino = require('pino')

interface Destination {
  minLength: number;
  sync: boolean;
  dest?: string;
}

let destination: Destination = {
  minLength: 4096, // Buffer before writing
  sync: false // Asynchronous logging
}

if (env.NODE_ENV === "development") {
    destination["dest"] = "~/logger/log"
}

const logger = pino(pino.destination(destination))

export default logger

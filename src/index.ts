/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 26/07/2021
 **  @Description
 ***********************************************************/

import * as winston from 'winston';
import {RabbitTransport} from "./RabbitTransport";

const Logger: any = (index: string, config: any) => {
  const log = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      // @ts-ignore
      new RabbitTransport(config, 'nowlog-' + index + '-' + process.env.MODE),
      new winston.transports.Console()
    ]
  });
  let requestId = 1000;
  const logger = {
    info: (...args: any) => {
      const child = log.child({requestId: requestId++})
      // @ts-ignore
      child.info(...args);
    },
    warn: (...args: any) => {
      const child = log.child({requestId: requestId++})
      // @ts-ignore
      child.warn(...args);
    },
    error: (...args: any) => {
      const child = log.child({requestId: requestId++})
      // @ts-ignore
      child.error(...args);
    },
    debug: (...args: any) => {
      const child = log.child({requestId: requestId++})
      // @ts-ignore
      child.debug(...args);
    }
  }
  const timer = (name: string, meta ?: any) => {
    const start = new Date().getTime();
    return {
      End: () => {
        const end = new Date().getTime();
        const diff = (end - start) / 1000;
        logger.debug({message: 'Task ' + name + ' duration: ' + diff + 's to execute', time: diff, taskName: name, ID : meta.ID })
        return Math.abs(diff);
      }
    }
  };
  return {logger, timer};
}
export default Logger

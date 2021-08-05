/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 26/07/2021
 **  @Description
 ***********************************************************/

import * as winston from 'winston';
import {RabbitTransport} from "./RabbitTransport";

interface logger {
    message: string | any; // log description
    ID?: string; // log id indicator used into elk for filtering
    taskName?: string; // name your task used on multiple log in same function
    err?: any; // display error, usually you have to use "message"
    time?: number; // in case of timer, the time is there
    [key: string]: any; // allowing wildcard entry;
}

interface rabbitInterface {
    protocol: 'amqp'; // default amqp
    hostname: string; // rabbit server host
    port: number; // rabbit server port
    username: string; // rabbit username
    password: string; // rabbit password
    locale?: string; // en_US, fr_FR etc..
    frameMax?: number; // default 0
    heartbeat?: number; // default 0
    vhost?: string; // default "/"
}

const Logger: any = (index: string, config: rabbitInterface) => {
    const log = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            // @ts-ignore
            new RabbitTransport(config, `nowlog-${index}-${(process.env.MODE || 'default')}`),
            new winston.transports.Console()
        ]
    });
    let requestId = 1000;
    const logger = {
        info: (args: logger) => {
            const child = log.child({requestId: requestId++})
            // @ts-ignore
            child.info(...args);
        },
        warn: (args: logger) => {
            const child = log.child({requestId: requestId++})
            // @ts-ignore
            child.warn(...args);
        },
        error: (args: logger) => {
            const child = log.child({requestId: requestId++})
            // @ts-ignore
            child.error(...args);
        },
        debug: (args: logger) => {
            const child = log.child({requestId: requestId++})
            // @ts-ignore
            child.debug(...args);
        }
    }
    const timer = (name: string, meta ?: logger) => {
        const start = new Date().getTime();
        return {
            End: () => {
                const end = new Date().getTime();
                const diff = (end - start) / 1000;
                logger.debug({
                    message: 'Task ' + name + ' duration: ' + diff + 's to execute',
                    time: diff,
                    taskName: name,
                    ID: meta.ID
                })
                return Math.abs(diff);
            }
        }
    };
    return {logger, timer};
}
export default Logger

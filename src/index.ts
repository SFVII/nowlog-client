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

const Logger: (index: string, config: rabbitInterface) => {
    timer: (name: string, meta?: logger) => {
        End: () => number;
        end: () => number
    };
    logger: {
        warn: (args: logger) => void;
        debug: (args: logger) => void;
        error: (args: logger) => void;
        info: (args: logger) => void
    };
    memoryBench: (BreakPoint: string, meta?: logger) => {
        end: () => number;
        End: () => number;
    }
} = (index: string, config: rabbitInterface) => {
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


    /*
        @ Name : timer
        @ Description : Analyse time between start and End
        @ Use case :
            const t = timer('helloworld');
              const test = 'hello world';
            const time = t.end(); // emit data;
            console.log(time) will print time in seconds
     */
    const timer = (name: string, meta ?: logger) => {
        const start = new Date().getTime();
        return {
            End: () => {
                const end = new Date().getTime();
                const diff = (end - start) / 1000;
                delete meta.message;
                delete meta.time;
                delete meta.taskName;
                logger.debug({
                    message: 'Task ' + name + ' duration: ' + diff + 's to execute',
                    time: diff,
                    taskName: name,
                    ...meta
                })
                return Math.abs(diff);
            },
            end: () => {
                const end = new Date().getTime();
                const diff = (end - start) / 1000;
                delete meta.message;
                delete meta.time;
                delete meta.taskName;
                logger.debug({
                    message: 'Task ' + name + ' duration: ' + diff + 's to execute',
                    time: diff,
                    taskName: name,
                    ...meta
                })
                return Math.abs(diff);
            }
        }
    };

    /*
        @ Name : memoryBench
        @ Description : log current memory usage of the app
        @ Use case :
            const m = memoryBench('myBreakPoint')
             // your code to analyze
            const bench = m.end() // emit value
            console.log(bench) => 150 will print value in MB
    */
    const memoryBench = (BreakPoint: string, meta ?: logger) => {
        const used: any = process.memoryUsage();
        const startUsage: number = Math.round(used.rss / 1024 / 1024 * 100) / 100;
        delete meta.message;
        delete meta.time;
        delete meta.taskName;
        delete meta.memory;
        return {
            end: () => {
                const endUsage: number = Math.round(used.rss / 1024 / 1024 * 100) / 100;
                const diff = endUsage - startUsage;
                logger.debug({
                    message: `Memory usage at ${BreakPoint} is ${diff} MB`,
                    taskName: BreakPoint,
                    memory: diff,
                    ...meta
                })
                return Math.abs(diff)
            },
            End: () => {
                const endUsage: number = Math.round(used.rss / 1024 / 1024 * 100) / 100;
                const diff = endUsage - startUsage;
                logger.debug({
                    message: `Memory usage at ${BreakPoint} is ${diff} MB`,
                    taskName: BreakPoint,
                    memory: diff,
                    ...meta
                })
                return Math.abs(diff)
            }
        }
    }
    return {logger, timer, memoryBench};
}
export default Logger

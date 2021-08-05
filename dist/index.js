"use strict";
/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 26/07/2021
 **  @Description
 ***********************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const RabbitTransport_1 = require("./RabbitTransport");
const Logger = (index, config) => {
    const log = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            // @ts-ignore
            new RabbitTransport_1.RabbitTransport(config, `nowlog-${index}-${(process.env.MODE || 'default')}`),
            new winston.transports.Console()
        ]
    });
    let requestId = 1000;
    const logger = {
        info: (args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.info(args);
        },
        warn: (args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.warn(args);
        },
        error: (args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.error(args);
        },
        debug: (args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.debug(args);
        }
    };
    /*
        @ Name : timer
        @ Description : Analyse time between start and End
        @ Use case :
            const t = timer('helloworld');
              const test = 'hello world';
            const time = t.end(); // emit data;
            console.log(time) will print time in seconds
     */
    const timer = (name, meta) => {
        const start = new Date().getTime();
        return {
            End: () => {
                const end = new Date().getTime();
                const diff = (end - start) / 1000;
                delete meta.message;
                delete meta.time;
                delete meta.taskName;
                logger.debug(Object.assign({ message: 'Task ' + name + ' duration: ' + diff + 's to execute', time: diff, taskName: name }, meta));
                return Math.abs(diff);
            },
            end: () => {
                const end = new Date().getTime();
                const diff = (end - start) / 1000;
                delete meta.message;
                delete meta.time;
                delete meta.taskName;
                logger.debug(Object.assign({ message: 'Task ' + name + ' duration: ' + diff + 's to execute', time: diff, taskName: name }, meta));
                return Math.abs(diff);
            }
        };
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
    const memoryBench = (BreakPoint, meta) => {
        const used = process.memoryUsage();
        const startUsage = Math.round(used.rss / 1024 / 1024 * 100) / 100;
        delete meta.message;
        delete meta.time;
        delete meta.taskName;
        delete meta.memory;
        return {
            end: () => {
                const endUsage = Math.round(used.rss / 1024 / 1024 * 100) / 100;
                const diff = endUsage - startUsage;
                logger.debug(Object.assign({ message: `Memory usage at ${BreakPoint} is ${diff} MB`, taskName: BreakPoint, memory: diff }, meta));
                return Math.abs(diff);
            },
            End: () => {
                const endUsage = Math.round(used.rss / 1024 / 1024 * 100) / 100;
                const diff = endUsage - startUsage;
                logger.debug(Object.assign({ message: `Memory usage at ${BreakPoint} is ${diff} MB`, taskName: BreakPoint, memory: diff }, meta));
                return Math.abs(diff);
            }
        };
    };
    return { logger, timer, memoryBench };
};
exports.default = Logger;

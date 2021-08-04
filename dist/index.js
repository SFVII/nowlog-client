"use strict";
/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 26/07/2021
 **  @Description
 ***********************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const RabbitTransport_1 = require("./RabbitTransport");
const Logger = (index, config) => {
    const log = winston_1.default.createLogger({
        level: 'info',
        format: winston_1.default.format.json(),
        transports: [
            // @ts-ignore
            new RabbitTransport_1.RabbitTransport(config, 'nowlog-' + index + '-' + process.env.MODE),
            new winston_1.default.transports.Console()
        ]
    });
    let requestId = 1000;
    const logger = {
        info: (...args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.info(...args);
        },
        warn: (...args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.warn(...args);
        },
        error: (...args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.error(...args);
        },
        debug: (...args) => {
            const child = log.child({ requestId: requestId++ });
            // @ts-ignore
            child.debug(...args);
        }
    };
    const timer = (name, meta) => {
        const start = new Date().getTime();
        return {
            End: () => {
                const end = new Date().getTime();
                const diff = (end - start) / 1000;
                logger.debug({ message: 'Task ' + name + ' duration: ' + diff + 's to execute', time: diff, taskName: name, ID: meta.ID });
                return Math.abs(diff);
            }
        };
    };
    return { logger, timer };
};
exports.default = Logger;

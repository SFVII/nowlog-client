/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 26/07/2021
 **  @Description
 ***********************************************************/
interface logger {
    message?: string | any;
    ID?: string;
    taskName?: string;
    err?: any;
    time?: number;
    [key: string]: any;
}
interface rabbitInterface {
    protocol: 'amqp';
    hostname: string;
    port: number;
    username: string;
    password: string;
    locale?: string;
    frameMax?: number;
    heartbeat?: number;
    vhost?: string;
}
declare const Logger: (index: string, config: rabbitInterface) => {
    timer: (name: string, meta?: logger) => {
        End: () => number;
        end: () => number;
    };
    logger: {
        warn: (args: logger) => void;
        debug: (args: logger) => void;
        error: (args: logger) => void;
        info: (args: logger) => void;
    };
    memoryBench: (BreakPoint: string, meta?: logger) => {
        end: () => number;
        End: () => number;
    };
};
export default Logger;

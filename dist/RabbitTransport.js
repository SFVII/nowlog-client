"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitTransport = void 0;
/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 27/07/2021
 **  @Description
 ***********************************************************/
const Rabbit = require("amqplib");
const os = require("os");
class RabbitTransport {
    constructor(rabbit, index) {
        this.rabbit = rabbit;
        this.index = index;
    }
    log(level, msg, meta, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publish) {
                this.conn = yield Rabbit.connect(this.rabbit).catch((err) => {
                    console.log('Error publisher', err);
                    process.exit(-1);
                });
                this.publish = yield this.conn.createChannel();
            }
            const date = new Date();
            this.publish.publish('', 'live-logs', Buffer.from(JSON.stringify({
                '@timestamp': date.getTime(),
                level,
                index: this.index,
                name: this.index,
                date,
                id: meta.ID,
                execName: meta.taskName,
                timeExecution: meta.time ? meta.time : undefined,
                message: msg,
                err: meta.err ? (typeof meta.err === 'object' ? JSON.stringify(meta.err) : meta.err) : undefined,
                host: os.hostname(),
                tags: [
                    level ? level : 'unknown',
                    msg.time && msg.message ? 'time_bench' : '',
                    os.hostname()
                ].filter((e) => e !== ''),
            })));
            if (callback) {
                callback(null, true);
            }
        });
    }
    logException(level, msg, meta, callback) {
        this.log('error', msg, meta, callback).catch((err) => console.log('error', err));
    }
    on(level, callback) {
        // not empty;
    }
}
exports.RabbitTransport = RabbitTransport;

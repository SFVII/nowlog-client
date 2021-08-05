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
            const execName = meta.taskName;
            const id = meta.ID;
            const timeExecution = meta.time;
            const message = msg || meta.message;
            const err = meta.err;
            delete meta.taskName;
            delete meta.ID;
            delete meta.message;
            delete meta.err;
            this.publish.publish('', 'live-logs', Buffer.from(JSON.stringify(Object.assign({ '@timestamp': date.getTime(), level, index: this.index, name: this.index, date,
                id,
                execName,
                timeExecution,
                message, err: err ? (typeof err === 'object' ? JSON.stringify(err) : err) : undefined, host: os.hostname(), tags: [
                    level ? level : 'unknown',
                    meta.time && msg.message ? 'time_bench' : '',
                    os.hostname()
                ].filter((e) => e !== '') }, meta))));
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

/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 27/07/2021
 **  @Description
 ***********************************************************/
import * as Rabbit from "amqplib";
import * as os from "os";

export class RabbitTransport {
  protected index: string;
  private conn: any;
  private publish: any;
  private rabbit: any;

  constructor(rabbit: any, index: string) {
    this.rabbit = rabbit;
    this.index = index;
  }

  async log(level: any, msg: any, meta: any, callback: (err: any, success: boolean) => any) {
    if (!this.publish) {
      this.conn = await Rabbit.connect(this.rabbit).catch((err: any) => {
        console.log('Error publisher', err);
        process.exit(-1)
      });
      this.publish = await this.conn.createChannel();
    }
    const date = new Date();
    this.publish.publish('', 'live-logs', Buffer.from(JSON.stringify({
      '@timestamp': date.getTime(),
      level,
      index: this.index,
      name:  this.index,
      date,
      id : meta.ID,
      execName : meta.taskName,
      timeExecution: meta.time ? meta.time : undefined,
      message: msg ,
      err: meta.err ? (typeof meta.err === 'object' ? JSON.stringify(meta.err) : meta.err) : undefined,
      host: os.hostname(),
      tags: [
        level ? level : 'unknown',
        meta.time && msg.message ? 'time_bench' : '',
        os.hostname()
      ].filter((e: string) => e !== ''),
    })));
    if (callback) {
      callback(null, true);
    }
  }

  logException(level: any, msg: any, meta: any, callback: () => any) {
    this.log('error', msg, meta, callback).catch((err: any) => console.log('error', err));
  }

  on(level: any, callback: () => any) {
    // not empty;
  }
}

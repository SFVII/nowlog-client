export declare class RabbitTransport {
    protected index: string;
    private conn;
    private publish;
    private rabbit;
    constructor(rabbit: any, index: string);
    log(level: any, msg: any, meta: any, callback: (err: any, success: boolean) => any): Promise<void>;
    logException(level: any, msg: any, meta: any, callback: () => any): void;
    on(level: any, callback: () => any): void;
}

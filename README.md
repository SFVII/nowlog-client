# Nowlog Client

Simple log service that will send datalog over rabbitMQ and publish it to Elastic stack;

## Dependecies 
 * RabbitMQ server
 * ELK stack

## How to use 

 ```
    ìmport Logger from "nowlog-client";
    
    const {logger, timer, memoryBench} = Logger(<Your namespace>, {RabbitHost, RabbitUser, RabbitPassword, RabbitPort});
    
    logger.info({
        message : <string description, or object error>,
        taskName : <Your task name into the namespace>,
        ID : <A custom Id to increase filter>
    })
     logger.error({
        message : <string description, or object error>,
        taskName : <Your task name into the namespace>,
        ID : <A custom Id to increase filter>
    })
     logger.debug({
        message : <string description, or object error>,
        taskName : <Your task name into the namespace>,
        ID : <A custom Id to increase filter>
    })
     logger.warn({
        message : <string description, or object error>,
        taskName : <Your task name into the namespace>,
        ID : <A custom Id to increase filter>
    })
    
    const m = memoryBench('MyBreakPoint, meta);
        //your task;
    m.end() // will return value of memory usage in MB and emit it to logger
    
    
    const t = timer('MyBreakPoint', meta);
    t.end() // will return value of time execution in seconds and emit it to logger
    
 ```

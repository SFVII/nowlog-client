# Nowlog Client

Simple log service that will send datalog over rabbitMQ and publish it to Elastic stack;

## Dependecies 
 * RabbitMQ server
 * ELK stack

## How to use 

 ```
    ìmport Logger from "nowlog-client";
    
    const {logger, timer} = Logger(<Your namespace>, {RabbitHost, RabbitUser, RabbitPassword, RabbitPort});
    
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
 ```

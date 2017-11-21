/**
 * Created by test on 17-11-2.
 */

import 'babel-core/register';
import 'babel-polyfill';

import WsOffset from './ws-offset';
import WsConsumer from './ws-consumer';
import WsProducer from './ws-producer';
import {KeyedMessage} from 'kafka-node';
import logger from '../logger';

const topic = 't3';

const test_offset = () =>{
    const t1 = new WsOffset();
    const payload = {
        topic: 'SUYUAN550',
        partition: 0, //default 0
        // time:
        // Used to ask for all messages before a certain time (ms), default Date.now(),
        // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
        time: -1,//Date.now(),
        maxNum: 1 //default 1
    };

    t1.async_fetch([payload])
        .then(data=>logger.info(data))
        .catch(error=>logger.error(error));

    // t1.async_fetchLatestOffsets(["SUYUAN550", 'RC1', "RC"])
    //     .then(data=>logger.info(data))
    //     .catch(error=>logger.error(error));
};

const test_consumer0 = () => {
    const c1 = new WsConsumer([{
        topic,
        offset: 0, //default 0
        partition: 0,
    }]);
    c1.listen((msg)=>console.log(msg), (error)=>console.error(error));
};

const test_consumer1 = () => {
    const c1 = new WsConsumer([{
        topic,
        offset: 0, //default 0
        partition: 1,
    }]);
    c1.listen((msg)=>console.log(msg), (error)=>console.error(error));
};

const test_producer = () => {
    const p1 = new WsProducer();
    const km = new KeyedMessage('key', 'message');
    const payloads =
        [
        { topic: topic, messages: 'hi', partitionerType:0 },
        { topic: topic, messages: ['hello', 'world', km], partitionerType:1 }
    ];
    // p1.sendPromise(payloads)
    setTimeout(()=>p1.sendPromise(payloads), 1000);
    // setTimeout(()=>p1.sendPromise(payloads), 5000);

};



// test_consumer0();
// test_consumer1();
// test_producer();
// test_offset();

import kafka from 'kafka-node';
import {zookeeper_host} from './const';
const Consumer = kafka.Consumer;
const Offset = kafka.Offset;
const Client = kafka.Client;
const client = new Client(zookeeper_host);

client.once('connect', function () {
    client.loadMetadataForTopics(['SUYUAN550'], function (error, results) {
        if (error) {
            return logger.error(error);
        }
        logger.info(results[1]['metadata']['SUYUAN550']['0']);
    });
});
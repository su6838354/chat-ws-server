/**
 * Created by test on 17-11-2.
 */

import kafka from 'kafka-node';
import {zookeeper_host} from './const';
import logger from '../logger';
// const Consumer = kafka.Consumer;
// const Consumer = kafka.HighLevelConsumer;
const Offset = kafka.Offset;
const Client = kafka.Client;
const ConsumerGroup = kafka.ConsumerGroup;

export default class WsConsumer{
    client = null;
    consumer = null;
    offset = null;
    constructor(payloads){
        this.client = new Client(zookeeper_host, 'consumer', {
            sessionTimeout: 30000,
            spinDelay : 1000,
            retries: 5
        });
        // const options = {
        //     groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
        //     // Auto commit config
        //     autoCommit: true,
        //     autoCommitIntervalMs: 5000,
        //     // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
        //     fetchMaxWaitMs: 100,
        //     // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
        //     fetchMinBytes: 1,
        //     // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
        //     fetchMaxBytes: 1024 * 1024,
        //     // If set true, consumer will fetch message from the given offset in the payloads
        //     fromOffset: false,
        //     // If set to 'buffer', values will be returned as raw buffer objects.
        //     encoding: 'utf8',
        //     keyEncoding: 'utf8'
        // };
        // this.consumer = new Consumer(this.client, payloads, options);

        const options = {
            host: `${zookeeper_host}:2181`,  // zookeeper host omit if connecting directly to broker (see kafkaHost below)
            // sessionTimeout: 30000,
            spinDelay : 1000,
            retries: 5,

            // kafkaHost: 'broker:9092', // connect directly to kafka broker (instantiates a KafkaClient)
            // zk : undefined,   // put client zk settings if you need them (see Client)
            // batch: undefined, // put client batch settings if you need them (see Client)
            // ssl: true, // optional (defaults to false) or tls options hash
            // groupId: 'kafka-node-group',
            sessionTimeout: 15000,
            // An array of partition assignment protocols ordered by preference.
            // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
            // protocol: ['roundrobin'],

            // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
            // equivalent to Java client's auto.offset.reset
            fromOffset: 'latest', // default

            // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
            outOfRangeOffset: 'earliest', // default
            // migrateHLC: false,    // for details please see Migration section below
            // migrateRolling: true

            groupId: 'kafka-node-group-1',//consumer group id, default `kafka-node-group`
            // Auto commit config
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
            fetchMaxWaitMs: 100,
            // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
            fetchMinBytes: 1,
            // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
            fetchMaxBytes: 1024 * 1024,
            // If set true, consumer will fetch message from the given offset in the payloads
            // fromOffset: false,
            // If set to 'buffer', values will be returned as raw buffer objects.
            encoding: 'utf8',
            keyEncoding: 'utf8'
        };

        this.consumer = new ConsumerGroup(options, payloads);

        this.offset = new Offset(this.client);
        /*
         * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
         */
        this.consumer.on('offsetOutOfRange', (topic) => {
            logger.warn('offsetOutOfRange', topic);
            topic.maxNum = 2;
            this.offset.fetch([topic], (err, offsets) => {
                if (err) {
                    return console.error(err);
                }
                const min = Math.min(offsets[topic.topic][topic.partition]);
                this.consumer.setOffset(topic.topic, topic.partition, min);
            });
        });
        this.consumer.on('error',  (err)=> {
            logger.error('consumer error', err);
            // this.consumer.addTopics(payloads, function (err, added) {
            //     logger.warn('add topics ', payloads, err, added);
            // });
        });

    }

    listen(messageCb){
        this.consumer.on('message', (message) => {
            messageCb(message);
            // this.offset.commit('kafka-node-group', [
            //     { topic: message.topic, partition: message.partition, offset: message.offset }
            // ], function (err, data) {
            //     console.log('====commit offset', err, data);
            // });
        });

    }

    close(){
        this.consumer.close((error, data)=>{
            if(error)
                logger.error('consumer close error', error)
        }); //force is disabled
        // this.client.close((error, data)=>{
        //     if(error)
        //         logger.error('consumer client close error', error)
        // });
    }
}











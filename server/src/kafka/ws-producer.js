/**
 * Created by test on 17-11-1.
 */

import kafka from 'kafka-node';
import {zookeeper_host} from './const';
const Producer = kafka.HighLevelProducer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;
import logger from '../logger';

export default class WsProducer{
    client = null;
    producer = null;
    ready = false;
    constructor(readyCb){
        this.client = new Client(zookeeper_host, 'producer', {
            sessionTimeout: 30000,
            spinDelay : 1000,
            retries: 5
        });
        this.producer = new Producer(this.client, { requireAcks: 1 });
        this.producer.on('ready', ()=>{
            logger.info('producer ready');
            this.ready=true;
            readyCb();
        });
        this.producer.on('error', function (err) {
            logger.error('producer error', err);
        });
    }

    async sendPromise(payloads){
        return new Promise((resolve, reject)=>{
            if(!this.ready){
                reject('producer not ready');
            }
            else {
                this.producer.send(payloads, function (err, result) {
                    if(err){
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }
        })
    }

    close(){
        this.producer.close((error, data)=>{
            if(error)
                logger.error('producer close error', error)
        });
        this.client.close((error, data)=>{
            if(error)
                logger.error('producer client close error', error)
        });
    }
}





/**
 * Created by test on 17-11-2.
 */

import WsProducer from './kafka/ws-producer';
import WsConsumer from './kafka/ws-consumer';
import logger from './logger';

export default class PersonPhone{
    ws_producer = null;
    ws_consumer = null;

    constructor(username){
        try{
            this.ws_producer = new WsProducer(()=>{
                const topics = [username];
                this.ws_producer.producer.createTopics(topics, false, function (err, data) {
                    if(err){
                        logger.error('createTopics error',topics, err);
                    }
                    else {
                        logger.info('createTopics', topics, data);
                    }
                });
            });
            this.ws_consumer = new WsConsumer(
                // [
                //     { topic: username, partition: 0 }
                // ]
                username
            );
        }
        catch (error){
            logger.error(error);
        }
    }

    callPersonPromise(from, to, data){
        try{
            const payloads =
                [
                    { topic: to, messages: [JSON.stringify(data)] }
                ];
            logger.info('phone call', payloads);
            return this.ws_producer.sendPromise(payloads)
        }
        catch (error){
            logger.error(error);
        }
    }


    listenPerson(messageCb){
        try{
            this.ws_consumer.listen(messageCb);
        }
        catch (error){
            logger.error('listenPerson error', error);
        }

    }

    close(){
        try{
            this.ws_consumer.close(true);

            this.ws_producer.close(true);
        }
        catch (error){
            logger.error('phone call close error', error);
        }

    }
}

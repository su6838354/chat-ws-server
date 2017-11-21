/**
 * Created by test on 17-11-2.
 */


import kafka from 'kafka-node';
import {zookeeper_host} from './const';


export default class WsOffset{
    constructor(){
        const client = new kafka.Client(zookeeper_host);
        this.offset = new kafka.Offset(client);
    }

    _fetch(payloads){
        return new Promise((resolve, reject)=>{
            this.offset.fetch(payloads, function (err, data) {
                if(err){
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        })
    }

    _fetchLatestOffsets = (topics)=>{
        return new Promise((resolve, reject)=>{
            this.offset.fetchLatestOffsets(topics, function (error, offsets) {
                if (error){
                    reject(error);
                }
                else {
                    resolve(offsets);
                }
                // console.log(offsets[topic][partition]);
            });
        })
    };

    async async_fetch(payloads){
        return await this._fetch(payloads)
    }

    async async_fetchLatestOffsets(topics){
        return await this._fetchLatestOffsets(topics)
    }
}



//
// offset.fetchCommits('kafka-node-group', [
//     { topic: 'Hello-Kafka'}
// ], function (err, data) {
//     console.log(data);
// });

// offset.fetchLatestOffsets(['Hello-Kafka'], function (error, offsets) {
//     if (error){
//         console.log(error);
//     }
//     console.log(offsets[topic][partition]);
// });



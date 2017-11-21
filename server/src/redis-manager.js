/**
 * Created by test on 17-11-3.
 */

import redis from 'redis';
import logger from './logger';
import {redis_host} from './const';

const HAS_NOTIFY_USER_STATUS = 'chat_user_update';
const ONLINE_USERS_HASH = 'chat_online_users';

class RedisManager{
    redis_client = null;
    constructor(){
        const RDS_PORT = 6379,        //端口号
        RDS_HOST = redis_host,    //服务器IP
        RDS_OPTS = {
            // auth_pass:RDS_PWD
        };
        this.redis_client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
        this.redis_client.on('ready',(err)=>{
            if(err){
                logger.error('redis ready error', err);
            }
            else {
                logger.info('redis ready success');
                this.redis_client.select('1', (err)=>{
                    if(err){
                        logger.error('redis select 1 failed ', err);
                    }
                    else {
                        logger.info('redis select 1 success');
                    }
                });
            }
        });
    }

    updateConnectBit = (socket, username) => {
        this.redis_client.hmset(ONLINE_USERS_HASH, socket.id, username);
        this.redis_client.set(HAS_NOTIFY_USER_STATUS, '1');
    };

    updateDisConnectBit = (socket) => {
        this.redis_client.hdel(ONLINE_USERS_HASH, socket.id);
        this.redis_client.set(HAS_NOTIFY_USER_STATUS, '1');
    };

    refreshNotifyUsersStatusBit = () => {
        this.redis_client.set(HAS_NOTIFY_USER_STATUS, '0');
    };

    getNotifyUserStatusPromise = () => {
        return new Promise((resolve, reject)=>{
            this.redis_client.get(HAS_NOTIFY_USER_STATUS, (error, data)=>{
                if(error){
                    reject(error);
                }
                else {
                    resolve(data);
                }
            });
        })

    };

    getAllUsersHashPromise = () => {
        return new Promise((reslove, reject)=>{
            this.redis_client.hgetall(ONLINE_USERS_HASH, (error, data)=>{
                if(error){
                    reject(error);
                }
                else {
                    reslove(data);
                }
            });
        })
    };

    deleteUserHash = (field) => {
        this.redis_client.hdel(ONLINE_USERS_HASH, field, (error, data)=>{
            if(error){
                logger.error(error);
            }
        });
    };
}

export default new RedisManager();
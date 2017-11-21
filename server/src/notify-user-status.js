/**
 * Created by test on 17-11-3.
 */

import redisManager from './redis-manager';
import logger from './logger';
import socketManager from './socket-manager';

export let g_users = {};

async function _process () {
    const clients = await socketManager.getClientsPromise();
    const hash_clients = await redisManager.getAllUsersHashPromise();
    const users = {};
    for (let socket_id in hash_clients){
        // hash socket 失效
        if(!clients.includes(socket_id)){
            logger.info('hdel reids',　socket_id, hash_clients[socket_id]);
            redisManager.deleteUserHash(socket_id);
        }
        //　hash socket　没有失效
        else {
            const username = hash_clients[socket_id];
            if(users[username]){
                users[username].push(socket_id);
            }
            else {
                users[username] = [socket_id];
            }
        }
    }
    g_users = users;
    socketManager.emit_users_status_to_all(users);
    redisManager.refreshNotifyUsersStatusBit();
}

async function process(){
    try{
        const isUpdate = await redisManager.getNotifyUserStatusPromise();
        if(isUpdate === '1'){
            logger.info('has user connect or disconnect, should notify all users');
            await _process();
        }
    }
    catch (error){
        logger.error('notifyUsersInfo', error);
    }
}

const notifyUsersStatus = () => {
    process().then().catch(error=>logger.error('notifyUsersStatus', error));
};

setInterval(notifyUsersStatus, 8000);
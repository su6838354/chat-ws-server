/**
 * Created by test on 17-11-3.
 */

import redisManager from './redis-manager';
import logger from './logger';
import PersonPhone from './person-phone';
import {default_io} from './app';
import {g_users} from './notify-user-status';

const msg_code = {
    WATCH_SEND_MSG: 'common_user_send_message',
    SEND_MEG: 'common_user_send_message_rep',

    WATCH_GET_USER_STATUS: 'common_all_users',
    SEND_USER_STATUS: 'common_all_users_rep',

    B_SEND_USER_STATUS: 'common_all_users_rep',

    WATCH_SEND_SYS_MSG: 'common_send_message',
    SEND_SYS_MSG: 'common_send_message_rep',

};

const process_connect = (socket) =>{
    try{
        let username = socket.handshake.query.username;
        if(username == ''){
            logger.error('get error username', username);
            return;
        }
        logger.info('connect', socket.id, username);
        redisManager.updateConnectBit(socket, username);
        socket.username = username;
        socket.username_hash = `${username}_${socket.id}`;
        socket.phone = new PersonPhone(username);
        // let error_count = 0;
        const listen = () => {
            socket.phone.listenPerson(
                (msg)=>{
                    emit_to_person(msg, socket);
                }
                // , (error)=>{
                //     logger.error(username, '---listen kafka error---->', error)
                //     if(error_count<10){
                //         setTimeout(listen, 2000);
                //         error_count++;
                //     }
                // }
                );
        };
        listen()

    }
    catch (error){
        logger.error('process_connect error', error);
    }
};

/***
 * 会话，某人接受到消息后，服务端发送给某人
 * @param msg
 * @param socket
 */
const emit_to_person = (msg, socket) => {
    logger.info('emit_to_person', msg);
    socket.emit(msg_code.SEND_MEG, JSON.parse(msg.value));
};

const watch_disconnect = (socket) =>{
    socket.on('disconnect', function () {
        try{
            logger.info('disconnect ', socket.username_hash);
            socket.phone.close();
            delete socket.phone;
            // admin_io.emit('admin_disconnect_user_rep', socket.username_hash);
        }
        catch (error){
            logger.error('disconnect error', error);
        }
        finally {
            redisManager.updateDisConnectBit(socket);
        }
    });
};

const watch_get_all_users_status = (socket) => {
    socket.on(msg_code.WATCH_GET_USER_STATUS, () => {
        try{
            socket.emit(msg_code.SEND_USER_STATUS, g_users);
        }
        catch (error){
            logger.error('watch_get_all_users_status error', error);
        }
    });
};

function getClientsPromise () {
    return new Promise((resolve, reject)=> {
        default_io.clients((error, clients)=>{
            if(error){
                reject(error);
            }
            else {
                resolve(clients);
            }
        });
    })
}

const emit_users_status_to_all = (users) => {
    default_io.emit(msg_code.B_SEND_USER_STATUS, users);
};

/***
 * 某人　接受消息
 * @param socket
 */
const watch_send_message = (socket) => {
    socket.on(msg_code.WATCH_SEND_MSG, (data)=>{
        try{
            const {from, to} = data;
            socket.phone.callPersonPromise(from, to, data).then(
                data=>console.log(data),
                error=>console.error(error)
            );
        }
        catch (error){
            logger.error('watch_send_message', error);
        }
    })
};

const watch_send_sys_message = (socket) => {
    socket.on(msg_code.WATCH_SEND_SYS_MSG, (data) => {
        try{
            logger.info('watch_send_sys_message', data);
            socket.emit(msg_code.SEND_SYS_MSG, data); //　推送给自己
            socket.broadcast.emit(msg_code.SEND_SYS_MSG, data);
        }
        catch (error){
            logger.error('watch_send_sys_message error', error);
        }
    });
};

export default {
    process_connect,
    emit_to_person,
    watch_disconnect,
    getClientsPromise,
    emit_users_status_to_all,
    watch_get_all_users_status,
    watch_send_message,
    watch_send_sys_message,
}
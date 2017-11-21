// Setup basic express server
import 'babel-core/register';
import 'babel-polyfill';
import express from 'express';
import logger from './logger';
import socket_io_redis from 'socket.io-redis';
import socket_io from 'socket.io';
import http from 'http';
import {redis_host} from './const';

const app = express();
const server = http.createServer(app);
const io = socket_io(server);



const port = process.env.PORT || 3000;
const serverName = process.env.NAME || 'Unknown';

io.adapter(socket_io_redis({ host: redis_host, port: 6379, requestsTimeout: 3000 }));

server.listen(port,　'0.0.0.0', function () {
  logger.info(`websocket server ${serverName} listening at port ${port}`);
});


// Health check
app.head('/health', function (req, res) {
  res.sendStatus(200);
});

import socketManager from './socket-manager';


export const default_io = io.on('connection', function (socket) {
    socketManager.process_connect(socket);

    // 断开
    socketManager.watch_disconnect(socket);

    //-----推送消息-------
    socketManager.watch_send_sys_message(socket);

    //---watch 获取当前在线人
    socketManager.watch_get_all_users_status(socket);

    //---　聊天
    socketManager.watch_send_message(socket);
});


export const admin_io = io.of('/admin').on('connection', function (socket) {
    logger.info('admin connect')
});




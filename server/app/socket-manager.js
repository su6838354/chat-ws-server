'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redisManager = require('./redis-manager');

var _redisManager2 = _interopRequireDefault(_redisManager);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _personPhone = require('./person-phone');

var _personPhone2 = _interopRequireDefault(_personPhone);

var _app = require('./app');

var _notifyUserStatus = require('./notify-user-status');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var msg_code = {
    WATCH_SEND_MSG: 'common_user_send_message',
    SEND_MEG: 'common_user_send_message_rep',

    WATCH_GET_USER_STATUS: 'common_all_users',
    SEND_USER_STATUS: 'common_all_users_rep',

    B_SEND_USER_STATUS: 'common_all_users_rep',

    WATCH_SEND_SYS_MSG: 'common_send_message',
    SEND_SYS_MSG: 'common_send_message_rep'

}; /**
    * Created by test on 17-11-3.
    */

var process_connect = function process_connect(socket) {
    try {
        var username = socket.handshake.query.username;
        if (username == '') {
            _logger2.default.error('get error username', username);
            return;
        }
        _logger2.default.info('connect', socket.id, username);
        _redisManager2.default.updateConnectBit(socket, username);
        socket.username = username;
        socket.username_hash = username + '_' + socket.id;
        socket.phone = new _personPhone2.default(username);
        // let error_count = 0;
        var listen = function listen() {
            socket.phone.listenPerson(function (msg) {
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
        listen();
    } catch (error) {
        _logger2.default.error('process_connect error', error);
    }
};

/***
 * 会话，某人接受到消息后，服务端发送给某人
 * @param msg
 * @param socket
 */
var emit_to_person = function emit_to_person(msg, socket) {
    _logger2.default.info('emit_to_person', msg);
    socket.emit(msg_code.SEND_MEG, JSON.parse(msg.value));
};

var watch_disconnect = function watch_disconnect(socket) {
    socket.on('disconnect', function () {
        try {
            _logger2.default.info('disconnect ', socket.username_hash);
            socket.phone.close();
            delete socket.phone;
            // admin_io.emit('admin_disconnect_user_rep', socket.username_hash);
        } catch (error) {
            _logger2.default.error('disconnect error', error);
        } finally {
            _redisManager2.default.updateDisConnectBit(socket);
        }
    });
};

var watch_get_all_users_status = function watch_get_all_users_status(socket) {
    socket.on(msg_code.WATCH_GET_USER_STATUS, function () {
        try {
            socket.emit(msg_code.SEND_USER_STATUS, _notifyUserStatus.g_users);
        } catch (error) {
            _logger2.default.error('watch_get_all_users_status error', error);
        }
    });
};

function getClientsPromise() {
    return new Promise(function (resolve, reject) {
        _app.default_io.clients(function (error, clients) {
            if (error) {
                reject(error);
            } else {
                resolve(clients);
            }
        });
    });
}

var emit_users_status_to_all = function emit_users_status_to_all(users) {
    _app.default_io.emit(msg_code.B_SEND_USER_STATUS, users);
};

/***
 * 某人　接受消息
 * @param socket
 */
var watch_send_message = function watch_send_message(socket) {
    socket.on(msg_code.WATCH_SEND_MSG, function (data) {
        try {
            var from = data.from,
                to = data.to;

            socket.phone.callPersonPromise(from, to, data).then(function (data) {
                return console.log(data);
            }, function (error) {
                return console.error(error);
            });
        } catch (error) {
            _logger2.default.error('watch_send_message', error);
        }
    });
};

var watch_send_sys_message = function watch_send_sys_message(socket) {
    socket.on(msg_code.WATCH_SEND_SYS_MSG, function (data) {
        try {
            _logger2.default.info('watch_send_sys_message', data);
            socket.emit(msg_code.SEND_SYS_MSG, data); //　推送给自己
            socket.broadcast.emit(msg_code.SEND_SYS_MSG, data);
        } catch (error) {
            _logger2.default.error('watch_send_sys_message error', error);
        }
    });
};

exports.default = {
    process_connect: process_connect,
    emit_to_person: emit_to_person,
    watch_disconnect: watch_disconnect,
    getClientsPromise: getClientsPromise,
    emit_users_status_to_all: emit_users_status_to_all,
    watch_get_all_users_status: watch_get_all_users_status,
    watch_send_message: watch_send_message,
    watch_send_sys_message: watch_send_sys_message
};
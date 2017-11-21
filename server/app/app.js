'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.admin_io = exports.default_io = undefined;

require('babel-core/register');

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _socket = require('socket.io-redis');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io');

var _socket4 = _interopRequireDefault(_socket3);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _const = require('./const');

var _socketManager = require('./socket-manager');

var _socketManager2 = _interopRequireDefault(_socketManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup basic express server
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = (0, _socket4.default)(server);

var port = process.env.PORT || 3000;
var serverName = process.env.NAME || 'Unknown';

io.adapter((0, _socket2.default)({ host: _const.redis_host, port: 6379, requestsTimeout: 3000 }));

server.listen(port, '0.0.0.0', function () {
    _logger2.default.info('websocket server ' + serverName + ' listening at port ' + port);
});

// Health check
app.head('/health', function (req, res) {
    res.sendStatus(200);
});

var default_io = exports.default_io = io.on('connection', function (socket) {
    _socketManager2.default.process_connect(socket);

    // 断开
    _socketManager2.default.watch_disconnect(socket);

    //-----推送消息-------
    _socketManager2.default.watch_send_sys_message(socket);

    //---watch 获取当前在线人
    _socketManager2.default.watch_get_all_users_status(socket);

    //---　聊天
    _socketManager2.default.watch_send_message(socket);
});

var admin_io = exports.admin_io = io.of('/admin').on('connection', function (socket) {
    _logger2.default.info('admin connect');
});
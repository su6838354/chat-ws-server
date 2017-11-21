'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by test on 17-11-3.
                                                                                                                                                           */

var HAS_NOTIFY_USER_STATUS = 'chat_user_update';
var ONLINE_USERS_HASH = 'chat_online_users';

var RedisManager = function RedisManager() {
    var _this = this;

    _classCallCheck(this, RedisManager);

    this.redis_client = null;

    this.updateConnectBit = function (socket, username) {
        _this.redis_client.hmset(ONLINE_USERS_HASH, socket.id, username);
        _this.redis_client.set(HAS_NOTIFY_USER_STATUS, '1');
    };

    this.updateDisConnectBit = function (socket) {
        _this.redis_client.hdel(ONLINE_USERS_HASH, socket.id);
        _this.redis_client.set(HAS_NOTIFY_USER_STATUS, '1');
    };

    this.refreshNotifyUsersStatusBit = function () {
        _this.redis_client.set(HAS_NOTIFY_USER_STATUS, '0');
    };

    this.getNotifyUserStatusPromise = function () {
        return new Promise(function (resolve, reject) {
            _this.redis_client.get(HAS_NOTIFY_USER_STATUS, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    };

    this.getAllUsersHashPromise = function () {
        return new Promise(function (reslove, reject) {
            _this.redis_client.hgetall(ONLINE_USERS_HASH, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    reslove(data);
                }
            });
        });
    };

    this.deleteUserHash = function (field) {
        _this.redis_client.hdel(ONLINE_USERS_HASH, field, function (error, data) {
            if (error) {
                _logger2.default.error(error);
            }
        });
    };

    var RDS_PORT = 6379,
        //端口号
    RDS_HOST = _const.redis_host,
        //服务器IP
    RDS_OPTS = {
        // auth_pass:RDS_PWD
    };
    this.redis_client = _redis2.default.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
    this.redis_client.on('ready', function (err) {
        if (err) {
            _logger2.default.error('redis ready error', err);
        } else {
            _logger2.default.info('redis ready success');
            _this.redis_client.select('1', function (err) {
                if (err) {
                    _logger2.default.error('redis select 1 failed ', err);
                } else {
                    _logger2.default.info('redis select 1 success');
                }
            });
        }
    });
};

exports.default = new RedisManager();
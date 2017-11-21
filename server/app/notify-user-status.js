'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.g_users = undefined;

var _process = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var clients, hash_clients, users, socket_id, username;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _socketManager2.default.getClientsPromise();

                    case 2:
                        clients = _context.sent;
                        _context.next = 5;
                        return _redisManager2.default.getAllUsersHashPromise();

                    case 5:
                        hash_clients = _context.sent;
                        users = {};

                        for (socket_id in hash_clients) {
                            // hash socket 失效
                            if (!clients.includes(socket_id)) {
                                _logger2.default.info('hdel reids', socket_id, hash_clients[socket_id]);
                                _redisManager2.default.deleteUserHash(socket_id);
                            }
                            //　hash socket　没有失效
                            else {
                                    username = hash_clients[socket_id];

                                    if (users[username]) {
                                        users[username].push(socket_id);
                                    } else {
                                        users[username] = [socket_id];
                                    }
                                }
                        }
                        exports.g_users = g_users = users;
                        _socketManager2.default.emit_users_status_to_all(users);
                        _redisManager2.default.refreshNotifyUsersStatusBit();

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function _process() {
        return _ref.apply(this, arguments);
    };
}();

var process = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var isUpdate;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _redisManager2.default.getNotifyUserStatusPromise();

                    case 3:
                        isUpdate = _context2.sent;

                        if (!(isUpdate === '1')) {
                            _context2.next = 8;
                            break;
                        }

                        _logger2.default.info('has user connect or disconnect, should notify all users');
                        _context2.next = 8;
                        return _process();

                    case 8:
                        _context2.next = 13;
                        break;

                    case 10:
                        _context2.prev = 10;
                        _context2.t0 = _context2['catch'](0);

                        _logger2.default.error('notifyUsersInfo', _context2.t0);

                    case 13:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 10]]);
    }));

    return function process() {
        return _ref2.apply(this, arguments);
    };
}();

var _redisManager = require('./redis-manager');

var _redisManager2 = _interopRequireDefault(_redisManager);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _socketManager = require('./socket-manager');

var _socketManager2 = _interopRequireDefault(_socketManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by test on 17-11-3.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

var g_users = exports.g_users = {};

var notifyUsersStatus = function notifyUsersStatus() {
    process().then().catch(function (error) {
        return _logger2.default.error('notifyUsersStatus', error);
    });
};

setInterval(notifyUsersStatus, 8000);
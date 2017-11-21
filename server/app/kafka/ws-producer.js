'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by test on 17-11-1.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _kafkaNode = require('kafka-node');

var _kafkaNode2 = _interopRequireDefault(_kafkaNode);

var _const = require('./const');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Producer = _kafkaNode2.default.HighLevelProducer;
var KeyedMessage = _kafkaNode2.default.KeyedMessage;
var Client = _kafkaNode2.default.Client;

var WsProducer = function () {
    function WsProducer(readyCb) {
        var _this = this;

        _classCallCheck(this, WsProducer);

        this.client = null;
        this.producer = null;
        this.ready = false;

        this.client = new Client(_const.zookeeper_host, 'producer', {
            sessionTimeout: 30000,
            spinDelay: 1000,
            retries: 5
        });
        this.producer = new Producer(this.client, { requireAcks: 1 });
        this.producer.on('ready', function () {
            _logger2.default.info('producer ready');
            _this.ready = true;
            readyCb();
        });
        this.producer.on('error', function (err) {
            _logger2.default.error('producer error', err);
        });
    }

    _createClass(WsProducer, [{
        key: 'sendPromise',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payloads) {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', new Promise(function (resolve, reject) {
                                    if (!_this2.ready) {
                                        reject('producer not ready');
                                    } else {
                                        _this2.producer.send(payloads, function (err, result) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(result);
                                            }
                                        });
                                    }
                                }));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function sendPromise(_x) {
                return _ref.apply(this, arguments);
            }

            return sendPromise;
        }()
    }, {
        key: 'close',
        value: function close() {
            this.producer.close(function (error, data) {
                if (error) _logger2.default.error('producer close error', error);
            });
            this.client.close(function (error, data) {
                if (error) _logger2.default.error('producer client close error', error);
            });
        }
    }]);

    return WsProducer;
}();

exports.default = WsProducer;
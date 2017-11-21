'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by test on 17-11-2.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _kafkaNode = require('kafka-node');

var _kafkaNode2 = _interopRequireDefault(_kafkaNode);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WsOffset = function () {
    function WsOffset() {
        var _this = this;

        _classCallCheck(this, WsOffset);

        this._fetchLatestOffsets = function (topics) {
            return new Promise(function (resolve, reject) {
                _this.offset.fetchLatestOffsets(topics, function (error, offsets) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(offsets);
                    }
                    // console.log(offsets[topic][partition]);
                });
            });
        };

        var client = new _kafkaNode2.default.Client(_const.zookeeper_host);
        this.offset = new _kafkaNode2.default.Offset(client);
    }

    _createClass(WsOffset, [{
        key: '_fetch',
        value: function _fetch(payloads) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.offset.fetch(payloads, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
    }, {
        key: 'async_fetch',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payloads) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this._fetch(payloads);

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function async_fetch(_x) {
                return _ref.apply(this, arguments);
            }

            return async_fetch;
        }()
    }, {
        key: 'async_fetchLatestOffsets',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(topics) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._fetchLatestOffsets(topics);

                            case 2:
                                return _context2.abrupt('return', _context2.sent);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function async_fetchLatestOffsets(_x2) {
                return _ref2.apply(this, arguments);
            }

            return async_fetchLatestOffsets;
        }()
    }]);

    return WsOffset;
}();

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


exports.default = WsOffset;
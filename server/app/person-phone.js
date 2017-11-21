'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by test on 17-11-2.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _wsProducer = require('./kafka/ws-producer');

var _wsProducer2 = _interopRequireDefault(_wsProducer);

var _wsConsumer = require('./kafka/ws-consumer');

var _wsConsumer2 = _interopRequireDefault(_wsConsumer);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PersonPhone = function () {
    function PersonPhone(username) {
        var _this = this;

        _classCallCheck(this, PersonPhone);

        this.ws_producer = null;
        this.ws_consumer = null;

        try {
            this.ws_producer = new _wsProducer2.default(function () {
                var topics = [username];
                _this.ws_producer.producer.createTopics(topics, false, function (err, data) {
                    if (err) {
                        _logger2.default.error('createTopics error', topics, err);
                    } else {
                        _logger2.default.info('createTopics', topics, data);
                    }
                });
            });
            this.ws_consumer = new _wsConsumer2.default(
            // [
            //     { topic: username, partition: 0 }
            // ]
            username);
        } catch (error) {
            _logger2.default.error(error);
        }
    }

    _createClass(PersonPhone, [{
        key: 'callPersonPromise',
        value: function callPersonPromise(from, to, data) {
            try {
                var payloads = [{ topic: to, messages: [JSON.stringify(data)] }];
                _logger2.default.info('phone call', payloads);
                return this.ws_producer.sendPromise(payloads);
            } catch (error) {
                _logger2.default.error(error);
            }
        }
    }, {
        key: 'listenPerson',
        value: function listenPerson(messageCb) {
            try {
                this.ws_consumer.listen(messageCb);
            } catch (error) {
                _logger2.default.error('listenPerson error', error);
            }
        }
    }, {
        key: 'close',
        value: function close() {
            try {
                this.ws_consumer.close(true);

                this.ws_producer.close(true);
            } catch (error) {
                _logger2.default.error('phone call close error', error);
            }
        }
    }]);

    return PersonPhone;
}();

exports.default = PersonPhone;
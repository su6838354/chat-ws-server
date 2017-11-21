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

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const Consumer = kafka.Consumer;
// const Consumer = kafka.HighLevelConsumer;
var Offset = _kafkaNode2.default.Offset;
var Client = _kafkaNode2.default.Client;
var ConsumerGroup = _kafkaNode2.default.ConsumerGroup;

var WsConsumer = function () {
    function WsConsumer(payloads) {
        var _this = this;

        _classCallCheck(this, WsConsumer);

        this.client = null;
        this.consumer = null;
        this.offset = null;

        this.client = new Client(_const.zookeeper_host, 'consumer', {
            sessionTimeout: 30000,
            spinDelay: 1000,
            retries: 5
        });
        // const options = {
        //     groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
        //     // Auto commit config
        //     autoCommit: true,
        //     autoCommitIntervalMs: 5000,
        //     // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
        //     fetchMaxWaitMs: 100,
        //     // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
        //     fetchMinBytes: 1,
        //     // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
        //     fetchMaxBytes: 1024 * 1024,
        //     // If set true, consumer will fetch message from the given offset in the payloads
        //     fromOffset: false,
        //     // If set to 'buffer', values will be returned as raw buffer objects.
        //     encoding: 'utf8',
        //     keyEncoding: 'utf8'
        // };
        // this.consumer = new Consumer(this.client, payloads, options);

        var options = {
            host: _const.zookeeper_host + ':2181', // zookeeper host omit if connecting directly to broker (see kafkaHost below)
            // sessionTimeout: 30000,
            spinDelay: 1000,
            retries: 5,

            // kafkaHost: 'broker:9092', // connect directly to kafka broker (instantiates a KafkaClient)
            // zk : undefined,   // put client zk settings if you need them (see Client)
            // batch: undefined, // put client batch settings if you need them (see Client)
            // ssl: true, // optional (defaults to false) or tls options hash
            // groupId: 'kafka-node-group',
            sessionTimeout: 15000,
            // An array of partition assignment protocols ordered by preference.
            // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
            // protocol: ['roundrobin'],

            // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
            // equivalent to Java client's auto.offset.reset
            fromOffset: 'latest', // default

            // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
            outOfRangeOffset: 'earliest', // default
            // migrateHLC: false,    // for details please see Migration section below
            // migrateRolling: true

            groupId: 'kafka-node-group-1', //consumer group id, default `kafka-node-group`
            // Auto commit config
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
            fetchMaxWaitMs: 100,
            // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
            fetchMinBytes: 1,
            // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
            fetchMaxBytes: 1024 * 1024,
            // If set true, consumer will fetch message from the given offset in the payloads
            // fromOffset: false,
            // If set to 'buffer', values will be returned as raw buffer objects.
            encoding: 'utf8',
            keyEncoding: 'utf8'
        };

        this.consumer = new ConsumerGroup(options, payloads);

        this.offset = new Offset(this.client);
        /*
         * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
         */
        this.consumer.on('offsetOutOfRange', function (topic) {
            _logger2.default.warn('offsetOutOfRange', topic);
            topic.maxNum = 2;
            _this.offset.fetch([topic], function (err, offsets) {
                if (err) {
                    return console.error(err);
                }
                var min = Math.min(offsets[topic.topic][topic.partition]);
                _this.consumer.setOffset(topic.topic, topic.partition, min);
            });
        });
        this.consumer.on('error', function (err) {
            _logger2.default.error('consumer error', err);
            // this.consumer.addTopics(payloads, function (err, added) {
            //     logger.warn('add topics ', payloads, err, added);
            // });
        });
    }

    _createClass(WsConsumer, [{
        key: 'listen',
        value: function listen(messageCb) {
            this.consumer.on('message', function (message) {
                messageCb(message);
                // this.offset.commit('kafka-node-group', [
                //     { topic: message.topic, partition: message.partition, offset: message.offset }
                // ], function (err, data) {
                //     console.log('====commit offset', err, data);
                // });
            });
        }
    }, {
        key: 'close',
        value: function close() {
            this.consumer.close(function (error, data) {
                if (error) _logger2.default.error('consumer close error', error);
            }); //force is disabled
            // this.client.close((error, data)=>{
            //     if(error)
            //         logger.error('consumer client close error', error)
            // });
        }
    }]);

    return WsConsumer;
}();

exports.default = WsConsumer;
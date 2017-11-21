'use strict';

require('babel-core/register');

require('babel-polyfill');

var _wsOffset = require('./ws-offset');

var _wsOffset2 = _interopRequireDefault(_wsOffset);

var _wsConsumer = require('./ws-consumer');

var _wsConsumer2 = _interopRequireDefault(_wsConsumer);

var _wsProducer = require('./ws-producer');

var _wsProducer2 = _interopRequireDefault(_wsProducer);

var _kafkaNode = require('kafka-node');

var _kafkaNode2 = _interopRequireDefault(_kafkaNode);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topic = 't3'; /**
                   * Created by test on 17-11-2.
                   */

var test_offset = function test_offset() {
    var t1 = new _wsOffset2.default();
    var payload = {
        topic: 'SUYUAN550',
        partition: 0, //default 0
        // time:
        // Used to ask for all messages before a certain time (ms), default Date.now(),
        // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
        time: -1, //Date.now(),
        maxNum: 1 //default 1
    };

    t1.async_fetch([payload]).then(function (data) {
        return _logger2.default.info(data);
    }).catch(function (error) {
        return _logger2.default.error(error);
    });

    // t1.async_fetchLatestOffsets(["SUYUAN550", 'RC1', "RC"])
    //     .then(data=>logger.info(data))
    //     .catch(error=>logger.error(error));
};

var test_consumer0 = function test_consumer0() {
    var c1 = new _wsConsumer2.default([{
        topic: topic,
        offset: 0, //default 0
        partition: 0
    }]);
    c1.listen(function (msg) {
        return console.log(msg);
    }, function (error) {
        return console.error(error);
    });
};

var test_consumer1 = function test_consumer1() {
    var c1 = new _wsConsumer2.default([{
        topic: topic,
        offset: 0, //default 0
        partition: 1
    }]);
    c1.listen(function (msg) {
        return console.log(msg);
    }, function (error) {
        return console.error(error);
    });
};

var test_producer = function test_producer() {
    var p1 = new _wsProducer2.default();
    var km = new _kafkaNode.KeyedMessage('key', 'message');
    var payloads = [{ topic: topic, messages: 'hi', partitionerType: 0 }, { topic: topic, messages: ['hello', 'world', km], partitionerType: 1 }];
    // p1.sendPromise(payloads)
    setTimeout(function () {
        return p1.sendPromise(payloads);
    }, 1000);
    // setTimeout(()=>p1.sendPromise(payloads), 5000);
};

// test_consumer0();
// test_consumer1();
// test_producer();
// test_offset();

var Consumer = _kafkaNode2.default.Consumer;
var Offset = _kafkaNode2.default.Offset;
var Client = _kafkaNode2.default.Client;
var client = new Client(_const.zookeeper_host);

client.once('connect', function () {
    client.loadMetadataForTopics(['SUYUAN550'], function (error, results) {
        if (error) {
            return _logger2.default.error(error);
        }
        _logger2.default.info(results[1]['metadata']['SUYUAN550']['0']);
    });
});
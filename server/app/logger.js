'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_log4js2.default.configure({
    appenders: {
        file: {
            type: 'file',
            filename: '../server.log',
            maxLogSize: 10 * 1024 * 1024, // = 10Mb
            numBackups: 5, // keep five backup files
            compress: true, // compress the backups
            encoding: 'utf-8',
            mode: 416,
            flags: 'w+'
        },
        dateFile: {
            type: 'dateFile',
            filename: '../server.log',
            pattern: 'yyyy-MM-dd',
            compress: true
        },
        out: {
            type: 'stdout'
        }
    },
    categories: {
        default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' }
    }
}); /**
     * Created by test on 17-11-3.
     */

var logger = _log4js2.default.getLogger('channel');
exports.default = logger;

// logger.trace('and this little thing went wee, wee, wee, all the way home.');
// logger.debug('This little thing went to market');
// logger.info('This little thing stayed at home');
// logger.warn('warn')
// logger.error('This little thing had roast beef');
// logger.fatal('This little thing had none');
// logger.mark('mark')
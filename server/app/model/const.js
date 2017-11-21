'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pool = undefined;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = _mysql2.default.createPool({
    host: '172.19.11.2 ',
    user: 'admin',
    password: 'admin',
    database: 'demo'
});

// const query=function(sql,options,callback){
//     pool.getConnection(function(err,conn){
//         if(err){
//             callback(err,null,null);
//         }else{
//             conn.query(sql,options,function(err,results,fields){
//                 //释放连接
//                 conn.release();
//                 //事件驱动回调
//                 callback(err,results,fields);
//             });
//         }
//     });
// };

/**
 * Created by test on 17-11-1.
 */

pool.query('show tables', function (err, result, fields) {
    return console.log('connect mysql success');
});

exports.pool = pool;
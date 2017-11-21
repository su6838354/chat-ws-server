/**
 * Created by test on 17-11-1.
 */

import mysql from 'mysql';

const pool = mysql.createPool({
    host: '172.19.11.2 ',
    user: 'admin',
    password: 'admin',
    database: 'demo',
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

pool.query('show tables', (err, result, fields)=>console.log('connect mysql success'));

export {
    pool
}
/**
 * Created by test on 17-10-31.
 */
var path = require('path')

try {
    require(path.join(__dirname, '../app'));
    require(path.join(__dirname, '../app/notify-user-status'))
} catch (e) {
    if (e && e.code === 'MODULE_NOT_FOUND') {
        console.log('run `npm compile` first!')
        process.exit(1)
    }
    console.log('app started with error and exited', e)
    process.exit(1)
}

console.log('app started in production mode')
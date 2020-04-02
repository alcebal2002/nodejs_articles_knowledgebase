process.argv.forEach(function (val, index, array) {
    //console.log ('Parameter found: ' + val);
    var arg = val.split("=");
    if (arg.length > 0) {
        if (arg[0] === 'env') {
            //console.log ('Loading: ./config/' + arg[1] + '.properties');
            //var env = require('./config/' + arg[1] + '.properties');
            var env = './config/' + arg[1] + '.properties';
            module.exports = env;
        }
    }
});
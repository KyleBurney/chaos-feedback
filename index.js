const Hapi = require('hapi');
var routes = require('./routes');

const server = Hapi.server({
    port: 8081,
    host: '127.0.0.1'
});

for (var i = 0; i < routes.length; i++) {
    server.route(routes[i]);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

server.start();
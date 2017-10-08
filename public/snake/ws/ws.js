'use strict';

const config = {
    wshost: 'ws://localhost:8080/ws'
};

const socket = new WebSocket(config.wshost);
socket.onopen = function() {
    socket.send(JSON.stringify({
        type: 'init',
        url: document.location.href,
        ref: document.referrer
    }));
};

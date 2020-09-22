// eslint-disable-next-line
import Peer from 'peerjs'
// eslint-disable-next-line
export const myPeer = new Peer(undefined, {
    // config: {'iceServers': [
    //   { url: 'stun:stun.l.google.com:19302' },
    //   { url: 'turn:homeo@turn.bistri.com:80', credential: 'homeo' }
    // ]} /* Sample servers, please use appropriate ones */
    host: '/',
    port: '3002',
    config: {
        'iceServers': [
            {
                urls: ["stun:stun.l.google.com:19302"],
                // urls: "stun:socket-prueba.playtecedu.com:3478"
            },
            // {
            //     urls: 'turn:socket-prueba.playtecedu.com:3478',
            //     username: 'ubuntu',
            //     credential: '12345'
            // }
        ]
    },

});
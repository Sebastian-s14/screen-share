
export const config = {
    iceServers: [
        {
            // urls: ["stun:stun.l.google.com:19302"],
            urls: "stun:socket-prueba.playtecedu.com:3478"
        },
        {
            urls: 'turn:socket-prueba.playtecedu.com:3478',
            username: 'ubuntu',
            credential: '12345'
        }
    ]
};

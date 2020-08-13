import React, { useEffect, useRef } from 'react'

import { socket } from "../../socket/socket";
import { StyledVideo } from '../../styled/StyledVideo';
import { config } from '../../webrtc/config';
// import { Container } from '../../styled/Container';
// import Draggable from 'react-draggable';
// import { Rnd } from 'react-rnd';

// const config = {
//     iceServers: [
//         {
//             urls: ["stun:stun.l.google.com:19302"]
//         }
//     ]
// };

let peerConnection
// let peerConnection = new RTCPeerConnection(config)

export const Watcher = () => {

    // let peerConnection;

    // const [peerConnection, setPeerConnection] = useState()

    const userVideo = useRef();
    // const peerConnection1 = useRef();
    // const nodeRef = React.useRef(null);
    // const peerConnection1 = useRef(new RTCPeerConnection(config));

    // let peerConnection
    // let peerConnection = new RTCPeerConnection(config);
    // const peerConnection = peerConnection1.current

    useEffect(() => {
        // let peerConnection = peerConnection1
        console.log('WATCHER')
        socket.emit("watcher");

        socket.on("offer", (id, description) => {
            console.log("offer")
            peerConnection = new RTCPeerConnection(config);
            // setPeerConnection(new RTCPeerConnection(config));
            peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, peerConnection.localDescription);
                });

            peerConnection.ontrack = event => {
                // console.log('PEER CONNECTION ONTRACK')
                // console.log(event)
                userVideo.current.srcObject = event.streams[0];
                // if (event.streams.length > 0) {
                //     console.log('hay streams')
                // } else {
                //     console.log('No hay streams')
                // }
            };

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };
        });

        socket.on("candidate", (id, candidate) => {
            console.log("candidate")
            // console.log(candidate)
            peerConnection
                .addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e));
        });

        // socket.on("connect", () => {
        //     console.log("connect");
        //     socket.emit("watcher");
        // });

        socket.on("broadcaster", () => {
            console.log("broadcaster");
            socket.emit("watcher");
        });

        socket.on("test", (data) => {
            console.log("test")
            console.log(data)
        });

        socket.on("disconnectPeer", () => {
            console.log("disconnectPeer")
            peerConnection.close();
        });

        // return () => {
        //     console.log('Desmontar componente')
        //     socket.on("disconnectPeer", () => {
        //         peerConnection.close();
        //     });

        //     window.onunload = window.onbeforeunload = () => {
        //         socket.close();
        //     };
        // }
    })


    function testEmit() {
        console.log("emit")
        socket.emit('test', "example")
    }

    // const style = {
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     border: "solid 1px #ddd",
    //     background: "#f0f0f0"
    //   };



    return (
        <div className="main-container">
            <h1>I'm a watcher!!</h1>
            <button onClick={ testEmit }>
                Test
            </button>
            {/* <Draggable
                nodeRef={ nodeRef }
                // bounds="body"
            > */}
                {/* <Container ref={nodeRef}> */}
                    <StyledVideo
                        // disablePictureInPicture
                        ref={ userVideo }
                        autoPlay
                        playsInline
                        // controls
                    />
                {/* </Container> */}
            {/* </Draggable> */}
        </div>
    )
}

import React, { useEffect, useRef } from 'react'

// import { socket } from "../../socket/socket";
import { socketStudent } from "../../socket/socketStudent";
import { StyledVideo } from '../../styled/StyledVideo';
import { config } from '../../webrtc/config';
// import { Container } from '../../styled/Container';
// import Draggable from 'react-draggable';
let peerConnection
// let peerConnection = new RTCPeerConnection(config)

export const Student = (props) => {

    // let peerConnection;

    // const [peerConnection, setPeerConnection] = useState()

    const roomID = props.match.params.roomID;

    const userVideo = useRef();

    useEffect(() => {
        // let peerConnection = peerConnection1
        // initWatcher.current = true
        console.log('WATCHER')

        socketStudent.emit("adduser", roomID, 1);

        socketStudent.emit("watcher", roomID, 2);

        socketStudent.on("offer", (id, description) => {
            console.log("offer")
            const peerConnection = new RTCPeerConnection(config);
            // setPeerConnection(new RTCPeerConnection(config));
            peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socketStudent.emit("answer", id, peerConnection.localDescription);
                });

            peerConnection.ontrack = event => {
                console.log('PEER CONNECTION ONTRACK')
                // console.log(event)
                userVideo.current.srcObject = event.streams[0];
                // if (event.streams.length > 0) {
                //     console.log('hay streams')
                // } else {
                //     console.log('No hay streams')
                // }
            };

            peerConnection.onicecandidate = event => {
                // console.log('ON ICE CANDIDATE')
                if (event.candidate) {
                    socketStudent.emit("candidate", id, event.candidate);
                }
            };
        });

        socketStudent.on("candidate", (id, candidate) => {
            console.log("candidate")
            // console.log(candidate)
            if (peerConnection) {
                peerConnection
                    .addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(e => console.error(e));
            }
        });

        // socket.on("connect", () => {
        //     console.log("connect");
        //     socket.emit("watcher");
        // });

        socketStudent.on("broadcaster", () => {
            console.log("broadcaster");
            // console.log(id)
            // if (initWatcher) {
            // socket.emit("watcher");
            console.log("emit watcher")
            socketStudent.emit("watcher", roomID, 2 );
            // }
        });

        socketStudent.on("test", (data) => {
            console.log("test")
            console.log(data)
        });

        // socketStudent.on("disconnectPeer", () => {
        //     console.log("disconnectPeer")
        //     peerConnection.close();
        // });

        // socketStudent.on("disconnect", () => {
        //     socketStudent.emit("disconnectPeer", roomID, 2)
        // })

        // socketStudent.on("Streaming", (data) => {
        //     console.log('Streaming')
        //     console.log(data)
        // });

        // return () => {
        //     console.log('Desmontar componente')
        //     // socketStudent.on("disconnectPeer", () => {
        //     //     peerConnection.close();
        //     // });
        //     window.onunload = window.onbeforeunload = () => {
        //         socketStudent.emit("disconnectPeer", roomID, 2)
        //         socketStudent.close();
        //     };
        // }
    }, [ roomID])


    function testEmit() {
        console.log("emit")
        // socket.emit('test', "example")
        // socket.emit('Streaming', id_access, outputStream);
    }

    function disconnect() {
        socketStudent.emit("disconnectPeer", roomID, 2)
    }

    return (
        <div className="main-container">
            <h1>I'm a watcher!!</h1>
            <button onClick={ testEmit }>
                Test
            </button>
            <button onClick={ disconnect }>
                Disconnect
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
                        muted
                        playsInline
                        controls
                    />
                {/* </Container> */}
            {/* </Draggable> */}
        </div>
    )
}

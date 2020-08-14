import React, { useEffect, useRef } from 'react'

import { socket } from "../../socket/socket";
import { Container } from '../../styled/Container';
import { StyledVideo } from '../../styled/StyledVideo';
import { config } from '../../webrtc/config';

const videoConstraints = {
    height: window.innerHeight,
    width: window.innerWidth
};

export const Broadcast = () => {

    const userVideo = useRef();
    const userStream = useRef()
    // const [peerConnection, setPeerConnection] = useState()

    // let peerConnection;
    // let peerConnection = new RTCPeerConnection(config);
    // const peerConnection1 = useRef(new RTCPeerConnection(config))
    // const peerConnection = peerConnection1.current


    useEffect(() => {
        const peerConnections = {};
        console.log('BROADCAST')

        // socket.on('connect', () => {
        //     console.log("connect")
        //     // console.log('connect broadcaster')
        //     socket.emit("broadcaster");
        // })

        socket.emit("broadcaster");

        socket.on("answer", (id, description) => {
            console.log("answer")
            peerConnections[id].setRemoteDescription(description);
        });

        socket.on("watcher", id => {
            console.log("watcher")
            console.log("New watcher")
            const peerConnection = new RTCPeerConnection(config);
            // setPeerConnection(new RTCPeerConnection(config));
            peerConnections[id] = peerConnection;

            let stream = userVideo.current.srcObject;
            // console.log('STREEEAMMMM')
            // console.log(userVideo.current.srcObject)
            // console.log(stream.getTracks()[0])
            // console.log(stream.getTrad)

            if (stream) {
                stream.getTracks().forEach(track => {
                    // console.log('In foreach')
                    // console.log(track)
                    // console.log(peerConnection)
                    peerConnection.addTrack(track, stream)
                });
                peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        socket.emit("candidate", id, event.candidate);
                    }
                };

                peerConnection
                    .createOffer()
                    .then(sdp => peerConnection.setLocalDescription(sdp))
                    .then(() => {
                        socket.emit("offer", id, peerConnection.localDescription);
                    });
            }


        });

        socket.on("candidate", (id, candidate) => {
            console.log("candidate")
            // console.log(candidate)
            // console.log(id)
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("test", data => {
            console.log('TEST SOCKETS')
            console.log(data)
        })

        socket.on("disconnectPeer", id => {
            console.log("disconnectPeer");
            peerConnections[id].close();
            delete peerConnections[id];
        });

        // return () => {

        //     socket.on("disconnectPeer", id => {
        //         peerConnections[id].close();
        //         delete peerConnections[id];
        //     });
        //     // window.onunload = window.onbeforeunload = () => {
        //     //     socket.close();
        //     // };
        //     // socket.close();

        // }
    })


    function getStream() {
        // if (window.stream) {
        //         window.stream.getTracks().forEach(track => {
        //         track.stop();
        //     });
        // }
        if (userStream.current) {
            userStream.current.getTracks().forEach(track => {
                // console.log('GET STREAM')
                // console.log(track)
                track.stop();
            });
        }
        const constraints = {
            audio: true,
            video: videoConstraints
        };
        return navigator.mediaDevices
            .getDisplayMedia(constraints)
            .then(gotStream)
            .catch(handleError);
    }

    function gotStream(stream) {
        // window.stream = stream;
        userStream.current = stream
        userVideo.current.srcObject = stream;
        socket.emit("broadcaster");
    }

    function handleError(error) {
        console.error("Error: ", error);
    }

    function stopStream() {
        // console.log('DETENER')
        if (userVideo.current && userVideo.current.srcObject) {
            // userVideo.current.getTracks().forEach(track => {
            //     console.log('GET STREAM')
            //     console.log(track)
            //     track.stop();
            // });
            let tracks = userVideo.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            userVideo.current.srcObject = null;
        } else {
            console.log('No hay srcObject')
        }
        // socket.emit("StreamingStop", id_access, 'Detener')
    }


    return (
        <>
            <button onClick={ getStream }>
                Iniciar!!!!
            </button>
            <button onClick={ stopStream }>
                Detener!!
            </button>
            <Container>
                <StyledVideo
                    ref={ userVideo }
                    autoPlay
                    playsInline
                />
            </Container>
        </>
    )
}

import React, { useEffect, useRef } from 'react'

// import { socket } from "../../socket/socket";
import { socketTeacher } from "../../socket/socketTeacher";
import { Container } from '../../styled/Container';
import { StyledVideo } from '../../styled/StyledVideo';
import { config } from '../../webrtc/config';

// const videoConstraints = {
//     height: window.innerHeight,
//     width: window.innerWidth
// };

const peerConnections = {};

export const Teacher = (props) => {

    const userVideo = useRef();
    const userStream = useRef()
    const roomID = props.match.params.roomID;
    // const [peerConnection, setPeerConnection] = useState()

    // let peerConnection;
    // let peerConnection = new RTCPeerConnection(config);
    // const peerConnection1 = useRef(new RTCPeerConnection(config))
    // const peerConnection = peerConnection1.current


    useEffect(() => {

        console.log(roomID)

        // const peerConnections = {};
        console.log('BROADCAST')

        // socket.on('connect', () => {
        //     console.log("connect")
        //     // console.log('connect broadcaster')
        //     socket.emit("broadcaster");
        // })
        // socket.emit("broadcaster");
        socketTeacher.emit("adduser", roomID, 1);
        // socketTeacher.emit("broadcaster", roomID, 1);
        // socket.emit("join room", roomID);

        socketTeacher.on("answer", (id, description) => {
            console.log("answer")
            // console.log(id)
            peerConnections[id].setRemoteDescription(description);
        });

        socketTeacher.on("watcher", ( id ) => {
            console.log("watcher")
            console.log(id)
            // console.log(data)
            console.log("New watcher")
            const peerConnection = new RTCPeerConnection(config);
            // setPeerConnection(new RTCPeerConnection(config));
            peerConnections[id] = peerConnection;

            let stream = userVideo.current.srcObject;

            if (stream) {
                stream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, stream)
                });

                peerConnection.onicecandidate = event => {
                    // console.log("ON ICE CANDIDATE")
                    // console.log(event)
                    if (event.candidate) {
                        socketTeacher.emit("candidate", id, event.candidate);
                    }
                };

                peerConnection
                    .createOffer()
                    .then(sdp => peerConnection.setLocalDescription(sdp))
                    .then(() => {
                        socketTeacher.emit("offer", id, peerConnection.localDescription);
                    });
            }
        });


        socketTeacher.on("candidate", (id, candidate) => {
            console.log("candidate")
            // console.log(candidate)
            // console.log(id)
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        socketTeacher.on("test", data => {
            console.log('TEST SOCKETS')
            console.log(data)
        })

        socketTeacher.on("disconnectPeer", id => {
            console.log("disconnectPeer");
            console.log(id)
            console.log(peerConnections)
            if (peerConnections) {
                peerConnections[id].close();
                delete peerConnections[id];
            }
        });

        // return () => {

            // socket.on("disconnectPeer", id => {
            //     peerConnections[id].close();
            //     delete peerConnections[id];
            // });
            // window.onunload = window.onbeforeunload = () => {
            //     socketTeacher.close();
            // };
        //     // socket.close();

        // }
    }, [roomID])


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
            // video: videoConstraints
        };
        return navigator.mediaDevices
            // .getDisplayMedia(constraints)
            .getUserMedia(constraints)
            .then(gotStream)
            .catch(handleError);
    }

    function gotStream(stream) {
        // window.stream = stream;
        userStream.current = stream
        // userVideo.current.srcObject = stream;
        // socket.emit("broadcaster");
        socketTeacher.emit("broadcaster", roomID, 1);
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

    function testEmit() {
        console.log("emit")
        socketTeacher.emit('test', roomID, 'hello')
        // socketTeacher.emit('Streaming', roomID, 'hello world');
    }


    return (
        <>
            <button onClick={ getStream }>
                Iniciar!!!!
            </button>
            <button onClick={ stopStream }>
                Detener!!
            </button>
            <button onClick={ testEmit }>
                Test room
            </button>
            <Container>
                <StyledVideo
                    ref={ userVideo }
                    autoPlay
                    playsInline
                    muted
                />
            </Container>
        </>
    )
}

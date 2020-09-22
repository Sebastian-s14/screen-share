import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
// import { StyledAudio, StyledVideo } from "../styled/StyledVideo";
import { Container } from "../styled/Container";
import { socket } from "../socket/socket";

// const videoConstraints = {
//     height: window.innerHeight,
//     width: window.innerWidth
// };

export const Viewer2 = (props) => {
    const [peers, setPeers] = useState([]);
    // const socketRef = useRef()
    const userVideo = useRef()
    const peersRef = useRef([])
    const streamRef = useRef()
    const socketRef = useRef()
    const roomID = props.match.params.roomID

    useEffect(() => {
        console.log('Room')
        socketRef.current = socket
        // socketRef.current.emit("join room", roomID);

        socket.on("disconnectPeer", id => {
            console.log("disconnectPeer");
            console.log(id)
            console.log(peersRef.current)
            if (peersRef.current) {
                peersRef.current[id].close();
                delete peersRef.current[id];
                setPeers(peersRef.current)
                // peer.destroy([err])
            }
        });

        socket.on("test", (data) => {
            console.log("test")
            console.log(data)
        });

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            streamRef.current = stream
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                console.log('all users')
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })
            // Enviar stream a los demas users cuando uno nuevo entra
            socketRef.current.on("user joined", payload => {
                console.log('user joined')
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });
            // el ultimo user recibe lo que envían los demas usuarios
            socketRef.current.on("receiving returned signal", payload => {
                console.log('receiving returned signal')
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })

    }, [roomID]);

    const testEmit = () => {
        console.log("emit")
        socket.emit('test', roomID, 'hello')
    }


    const compartir2 = () => {

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            streamRef.current = stream
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                console.log('all users')
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })
            // Enviar stream a los demas users cuando uno nuevo entra
            socketRef.current.on("user joined", payload => {
                console.log('user joined')
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });
            // el ultimo user recibe lo que envían los demas usuarios
            socketRef.current.on("receiving returned signal", payload => {
                console.log('receiving returned signal')
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }

    const stopStream = () => {
        console.log('Detener Stream')
        // if (streamRef.current) {
        //     streamRef.current.getTracks().forEach(track => track.stop())
        // }

        if (userVideo.current && userVideo.current.srcObject) {
            let tracks = userVideo.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                userVideo.current.srcObject = null;
        }
    }

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div>
            <button onClick={ compartir2 }>
                Iniciar transmisión!
            </button>
            <hr/>
            <button onClick={ stopStream }>
                Detener transmisión
            </button>

            <button onClick={ testEmit }>
                Mensaje de prueba
            </button>
            {/* <Container>
                <StyledVideo muted ref={ userVideo } autoPlay playsInline />
            </Container> */}
            <hr/>
            <Container>
                {/* <StyledVideo
                    muted
                    ref={userVideo}
                    autoPlay
                    playsInline
                /> */}
                <audio
                    ref={userVideo}
                    autoPlay
                    controls
                />
                {
                    peers.map((peer, index) =>
                        <VideoAudio
                            key={index}
                            peer={peer}
                        />
                    )
                }
            </Container>
        </div>
    );
};


const VideoAudio = (props) => {
    const ref = useRef()

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream
        })
    }, [props.peer])

    return (
        // <StyledVideo
        //     playsInline
        //     autoPlay
        //     ref={ref}
        // />
        <audio
            autoPlay
            controls
            ref={ref}
        />
    )
}




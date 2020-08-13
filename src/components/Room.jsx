import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";
import { StyledVideo } from "../styled/StyledVideo";
import { Container } from "../styled/Container";
import { socket } from "../socket/socket";

const videoConstraints = {
    height: window.innerHeight,
    width: window.innerWidth
};

export const Room = (props) => {
    // const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    useEffect(() => {
        console.log('Room')
        socketRef.current = socket
        socketRef.current.emit("join room", roomID);
        // socket.emit("join room", roomID);
    }, [roomID]);

    function addPeer(incomingSignal, callerID, stream) {
        console.log('Add Peer')
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

    function compartir() {
        navigator.mediaDevices.getDisplayMedia({ video: videoConstraints, audio: true })
            .then(stream => {
                userVideo.current.srcObject = stream;

                socketRef.current.on("sending signal", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
                });
            })
            .catch(err => {
                console.log('ocurrio un error')
                console.log(err)
            })
    }

    return (
        <>
            <button onClick={ compartir }>
                Iniciar
            </button>
            <Container>
                <StyledVideo muted ref={ userVideo } autoPlay playsInline />
            </Container>
        </>
    );
};

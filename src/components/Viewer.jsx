import React, { useEffect, useState, useRef } from 'react'
import Peer from "simple-peer";
// import { useParams } from 'react-router-dom';
import { socket } from '../socket/socket';

import { Video } from './Video';

export const Viewer = (props) => {

    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const peersRef = useRef([]);

    // let roomID = useParams()
    const roomID = props.match.params.roomID;

    useEffect(() => {

        // console.log(roomID)

        // console.log('VIEWER COMPONENT')
        socketRef.current = socket

        socket.emit("join room", roomID);

        socket.on("join room", users => {
            console.log(users)
            const peers = [];
            users.forEach(userID => {
                // const peer = createPeer(userID, socketRef.current.id);
                const peer = createPeer(userID, socket.id);
                peersRef.current.push({
                    peerID: userID,
                    peer,
                })
                peers.push(peer);
            })
            setPeers(peers);
        })

        socket.on("sending signal", payload => {
            const peer = addPeer(payload.signal, payload.callerID);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })

            setPeers(users => [...users, peer]);
        });

        socket.on("returning signal", payload => {
            console.log('returning signal')
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });

        socket.on("test2", (data) => {
            console.log('recibiendo test')
            console.log(data)
        })

    }, [roomID])

    function createPeer(userToSignal, callerID) {
        console.log('Create Peer')
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });

        peer.on("signal", signal => {
            // socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
            socket.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID) {
        console.log('Add Peer')
        const peer = new Peer({
            initiator: false,
            trickle: false,
        })

        peer.on("signal", signal => {
            // socketRef.current.emit("returning signal", { signal, callerID })
            socket.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    function testEmit() {
        console.log("emit")
        socketRef.current.emit('test', "example")
        console.log(peers)
    }

    return (
        <div>
            <h1>I'm a viewer</h1>
            <button onClick={ testEmit }>
                Test scoket
            </button>
            {
                // peers.map((peer, index) => <Video key={ index } peer={ peer } />)

                <Video peer={ peers[0] } />
            }
        </div>
    )
}

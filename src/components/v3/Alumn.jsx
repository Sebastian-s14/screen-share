import React, { useCallback, useEffect, useRef, useState } from 'react'

import { socket } from '../../socket/socket2'
import { myPeer } from '../../webrtc/config2'

// const videoGrid = document.getElementById('video-grid')
// const myVideo = document.createElement('video')
// myVideo.muted = true
// const peers = {}

const Alumn = (props) => {

    const roomID = props.match.params.roomID

    // const [alumns, setAlumns] = useState([])
    const userVideo = useRef()
    const peers = useRef({})
    const [idUser, setIdUser] = useState()
    // const remoteAlumn = useRef()
    const videoGrid = useRef(null)

    const connectToNewUser = useCallback(
        (userId, stream) => {
            const call = myPeer.call(userId, stream)
            // const video = document.createElement('video')
            const media = document.createElement('audio');

            call.on('stream', userMediaStream => {
                console.log(stream)
                console.log(userMediaStream)
                addMediaStream(media, userMediaStream)
            })

            call.on('close', () => {
                console.log('====close====')
                media.remove()
            })

            peers.current[userId] = call
        },
        [],
    )

    // const connectToNewUser = (userId, stream) => {
    //     const call = myPeer.call(userId, stream)
    //     // const video = document.createElement('video')
    //     const video = document.createElement('audio');

    //     call.on('stream', userMediaStream => {
    //         console.log(stream)
    //         console.log(userMediaStream)
    //         addVideoStream(video, userMediaStream)
    //     })

    //     call.on('close', () => {
    //         console.log('close')
    //         video.remove()
    //     })

    //     peers[userId] = call
    // }

    // remote add video or audio users
    const addMediaStream = (media, stream) => {

        // ************************************
        media.srcObject = stream
        media.addEventListener('loadedmetadata', () => {
            media.play()
        })
        videoGrid.current.append(media)
        // ************************************

        // console.log(stream)
        // setAlumns(alumns => [...alumns, stream])
    }

    const startConnection = async () => {

        socket.emit('join-room', roomID, idUser)

        await navigator.mediaDevices.getUserMedia({
            // video: true,
            audio: true
        }).then(stream => {
            // addVideoStream(myVideo, stream)
            userVideo.current.srcObject = stream

            myPeer.on('call', call => {
                call.answer(stream)
                //   const video = document.createElement('video')
                const video = React.createElement('audio')
                call.on('stream', userMediaStream => {
                    addMediaStream(video, userMediaStream)
                })
            })

            socket.on('user-connected', userId => {
                console.log('user-connected')
                connectToNewUser(userId, stream)
            })
        })
    }

    const stopStream = () => {
        console.log('Detener Stream')
        // if (streamRef.current) {
        //     streamRef.current.getTracks().forEach(track => track.stop())
        // }

        if (userVideo.current && userVideo.current.srcObject) {
            console.log('STOP')
            let tracks = userVideo.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            // userVideo.current.srcObject = null;
        }

    }

    const testSocket = () => {
        console.log('test socket')
        socket.emit('test')
    }


    const getAlumns = () => {
        console.log('GET ALUMNS')
        // console.log(peers)
        console.log(peers.current)
    }

    useEffect(() => {

        // const peers = {}

        // const myVideo = document.createElement('video')
        // myVideo.muted = true

        navigator.mediaDevices.getUserMedia({
            // video: true,
            audio: true
        }).then(stream => {
            // addVideoStream(myVideo, stream)
            userVideo.current.srcObject = stream

            myPeer.on('call', call => {
                call.answer(stream)
                  const video = document.createElement('audio')
                // const video = React.createElement('audio')
                call.on('stream', userMediaStream => {
                    addMediaStream(video, userMediaStream)
                })
            })

            socket.on('user-connected', userId => {
                console.log('user-connected')
                connectToNewUser(userId, stream)
            })
        })

        socket.on('user-disconnected', userId => {
            console.log('user-diconnected')
            console.log(userId)
            console.log(peers.current)
            if (peers.current[userId]) {
                console.log('desconectar')
                peers.current[userId].close()
            }
        })

        myPeer.on('open', id => {
            console.log('join-room')
            socket.emit('join-room', roomID, id)
            setIdUser(id)
        })

        socket.on("test", (data) => {
            console.log("test")
            console.log(data)
        });

    }, [roomID, connectToNewUser])

    return (
        <div>
            <button onClick={ startConnection }>
                Iniciar
            </button>
            <button onClick={ stopStream }>
                Detener
            </button>
            <button onClick={ testSocket }>
                Test socket
            </button>
            <hr/>
            <button onClick={ getAlumns }>
                Get Alumns
            </button>
            <audio
                ref={userVideo}
                autoPlay
                controls
                muted
            />
            <div
                id="video-grid"
                ref={ videoGrid }
            ></div>
            {
                // alumns.map((peer, index) =>
                //     <VideoAudio
                //         key={index}
                //         peer={peer}
                //     />
                // )
                // alumns.map((alumn, index) =>
                //     <audio
                //     ></audio>
                // )
            }
        </div>
    )
}

export default Alumn


// const VideoAudio = (props) => {
//     const ref = useRef()

//     useEffect(() => {
//         props.peer.on("stream", stream => {
//             ref.current.srcObject = stream
//         })
//     }, [props.peer])

//     return (
//         // <StyledVideo
//         //     playsInline
//         //     autoPlay
//         //     ref={ref}
//         // />
//         <audio
//             autoPlay
//             controls
//             ref={ref}
//         />
//     )
// }
import React, { useRef, useEffect } from 'react'

import { StyledVideo } from '../styled/StyledVideo';

export const Video = (props) => {

    const ref = useRef();

    useEffect(() => {
        console.log('VIDEO')
        if (props.peer) {
            console.log(props.peer)
            props.peer.on("stream", stream => {
                ref.current.srcObject = stream;
            })
        } else {
            console.log('no hay peer')
        }
    }, [props.peer]);

    return <StyledVideo playsInline autoPlay ref={ ref } controls/>

}

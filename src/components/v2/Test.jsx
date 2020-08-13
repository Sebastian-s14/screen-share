import React, { useEffect } from 'react'
import { socket } from '../../socket/socket'

export const Test = () => {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connect')
        })
    }, [])

    return (
        <div>
            test component
        </div>
    )
}

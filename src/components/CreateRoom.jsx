import React from "react";
import { v1 as uuid } from "uuid";

export const CreateRoom = (props) => {

    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return <button onClick={ create }>Create room</button>

};

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { CreateRoom } from '../components/CreateRoom';
// import { Room } from '../components/Room';
// import { Viewer } from '../components/Viewer';
// import { Broadcast } from '../components/v2/Broadcast';
// import { Watcher } from '../components/v2/Watcher';
// import { Test } from '../components/v2/Test';
import Alumn from '../components/v3/Alumn';
import Professor from '../components/v3/Professor';
// import { Viewer2 } from '../components/Viewer2';
// import { Teacher } from '../components/v1/Teacher';
// import { Student } from '../components/v1/Student';

export const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={ CreateRoom } />
                {/* <Route exact path="/room/:roomID" component={ Room } /> */}
                {/* <Route exact path="/viewer/:roomID" component={ Viewer } /> */}
                {/* <Route exact path="/viewer/:roomID" component={ Viewer2 } /> */}
                <Route exact path="/professor/:roomID" component={ Professor } />
                <Route exact path="/alumn/:roomID" component={ Alumn } />
                {/* <Route exact path="/broadcast/:roomID" component={ Broadcast } />
                <Route exact path="/watcher/:roomID" component={ Watcher } /> */}
                {/* <Route exact path="/broadcast/:roomID" component={ Teacher } />
                <Route exact path="/watcher/:roomID" component={ Student } /> */}
                {/* <Route exact path="/test" component={ Test } /> */}
            </Switch>
        </Router>
    )
}

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { CreateRoom } from '../components/CreateRoom';
import { Room } from '../components/Room';
import { Viewer } from '../components/Viewer';
import { Broadcast } from '../components/v2/Broadcast';
import { Watcher } from '../components/v2/Watcher';
import { Test } from '../components/v2/Test';

export const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={ CreateRoom } />
                <Route exact path="/room/:roomID" component={ Room } />
                <Route exact path="/viewer/:roomID" component={ Viewer } />
                <Route exact path="/broadcast" component={ Broadcast } />
                <Route exact path="/watcher" component={ Watcher } />
                <Route exact path="/test" component={ Test } />
            </Switch>
        </Router>
    )
}

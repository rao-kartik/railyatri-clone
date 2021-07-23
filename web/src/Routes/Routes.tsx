import React from 'react'
import { Route, Switch } from 'react-router-dom'
import LandingPage from '../Components/landingPage/LandingPage'
import Buses from "../Components/Buses/Buses"

export default function Routes() {
    return (
        <div>
            <Switch>
                <Route exact path="/">
                <Buses />
                </Route>
                <Route path="/bus-booking">
                    <LandingPage />
                </Route>
            </Switch>
        </div>
    )
}
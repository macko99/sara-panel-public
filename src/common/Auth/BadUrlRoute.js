import React from 'react';
import { Route, Redirect } from "react-router-dom";

const BadUrlRoute = ({ auth, ...rest }) => {

    return (
        <Route {...rest} render={(props) => (
            auth === true
                ? <Redirect to="/home" />
                : <Redirect to='/login'/>
        )}/>
    )
}

export default BadUrlRoute;
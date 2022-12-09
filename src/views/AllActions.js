import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
// import EventBus from "../common/Auth/EventBus";
import AllActionsStates from "../AllActionsComponents/AllActionsStates";
import MySpinner from "../common/MySpinner";
import {Container, ToastContainer} from "react-bootstrap";
import requestBasicGet from "../services/getRequestBasic";

const AllActions = () => {

    // ----- STATES -----
    const [actionsData, setActionsData] = useState("");

    const [loading, setLoading] = useState(true);
    const [anotherRequest, setAnotherRequest] = useState('');

    // ----- HOOKS -----
    // GET actions data
    useEffect(() => {
        requestBasicGet(UserService.getActions, setActionsData, '');
    }, [anotherRequest])


    // stop loading once data is loaded
    useEffect(() => {
        setLoading( !(actionsData) )
    },[actionsData])

    // ----- RENDER -----
    if(loading) return <MySpinner />;

    return (
        <div>
            {actionsData &&
                <AllActionsStates
                    actionsData={actionsData}
                    setAnotherRequest={setAnotherRequest}
                />
            }
            <ToastContainer/>
        </div>
    );
};

export default AllActions;

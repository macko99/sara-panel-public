import React from 'react';
import {ToastContainer} from "react-bootstrap";

const NotificationsContainer = (props) => {

    const notificationsList = props.notificationsList

    if (notificationsList && notificationsList.length === 0)
        return null;

    return (
        <ToastContainer position="bottom-start">
            {notificationsList}
        </ToastContainer>
    );
};

export default NotificationsContainer;
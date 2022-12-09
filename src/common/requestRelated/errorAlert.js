import React from 'react';
import EventBus from "../Auth/EventBus";

function errorAlert(error, setLoading=false) {

    if(setLoading)
        setLoading(false);

    if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
    }
    else {
        const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

        alert("Błąd:" + resMessage)
    }
}

export default errorAlert;